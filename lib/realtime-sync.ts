/**
 * Real-time Synchronization System with Multi-Device Support
 * Enables seamless data sync across devices and cloud storage
 */

export interface SyncConfig {
  enabled: boolean
  provider: 'cloud' | 'local' | 'hybrid'
  autoSync: boolean
  syncInterval: number
  conflictResolution: 'latest' | 'merge' | 'manual'
}

export interface SyncMetadata {
  lastSyncTime: number
  lastModified: number
  syncStatus: 'synced' | 'syncing' | 'pending' | 'conflict'
  deviceId: string
  version: number
}

export interface ConflictResolution {
  local: any
  remote: any
  merged?: any
  resolution: 'local' | 'remote' | 'merged'
}

class RealtimeSyncManager {
  private config: SyncConfig
  private metadata: Map<string, SyncMetadata>
  private syncQueue: Array<{ key: string; data: any; timestamp: number }>
  private deviceId: string
  private listeners: Set<(data: any) => void>

  constructor(config: Partial<SyncConfig> = {}) {
    this.config = {
      enabled: true,
      provider: 'hybrid',
      autoSync: true,
      syncInterval: 30000,
      conflictResolution: 'latest',
      ...config,
    }
    this.metadata = new Map()
    this.syncQueue = []
    this.listeners = new Set()
    this.deviceId = this.generateDeviceId()
    this.initializeSyncSystem()
  }

  private generateDeviceId(): string {
    let deviceId = localStorage.getItem('ecosort_device_id')
    if (!deviceId) {
      deviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem('ecosort_device_id', deviceId)
    }
    return deviceId
  }

  private initializeSyncSystem(): void {
    if (this.config.autoSync) {
      setInterval(() => this.processSyncQueue(), this.config.syncInterval)
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.handleOnline())
      window.addEventListener('offline', () => this.handleOffline())
    }
  }

  async syncData(key: string, data: any): Promise<boolean> {
    try {
      const timestamp = Date.now()
      this.syncQueue.push({ key, data, timestamp })

      if (navigator.onLine) {
        return await this.processSync(key, data, timestamp)
      } else {
        this.updateMetadata(key, { syncStatus: 'pending', lastModified: timestamp })
        return false
      }
    } catch (error) {
      console.error('[v0] Sync error:', error)
      return false
    }
  }

  private async processSync(key: string, data: any, timestamp: number): Promise<boolean> {
    try {
      this.updateMetadata(key, { syncStatus: 'syncing' })

      const localData = localStorage.getItem(key)
      const remoteData = await this.fetchRemoteData(key)

      if (remoteData && localData !== JSON.stringify(data)) {
        const conflict = this.detectConflict(data, remoteData)
        if (conflict) {
          return await this.resolveConflict(key, conflict)
        }
      }

      localStorage.setItem(key, JSON.stringify(data))
      this.updateMetadata(key, {
        syncStatus: 'synced',
        lastSyncTime: timestamp,
        lastModified: timestamp,
      })

      this.notifyListeners({ key, data, action: 'sync' })
      return true
    } catch (error) {
      console.error('[v0] Process sync error:', error)
      this.updateMetadata(key, { syncStatus: 'conflict' })
      return false
    }
  }

  private detectConflict(local: any, remote: any): boolean {
    return JSON.stringify(local) !== JSON.stringify(remote)
  }

  private async resolveConflict(key: string, conflict: ConflictResolution): Promise<boolean> {
    let resolved: any

    switch (this.config.conflictResolution) {
      case 'latest':
        resolved = conflict.local.timestamp > conflict.remote.timestamp
          ? conflict.local
          : conflict.remote
        break
      case 'merge':
        resolved = this.mergeData(conflict.local, conflict.remote)
        break
      default:
        return false
    }

    localStorage.setItem(key, JSON.stringify(resolved))
    this.updateMetadata(key, { syncStatus: 'synced', conflictResolution: 'merged' })
    return true
  }

  private mergeData(local: any, remote: any): any {
    if (Array.isArray(local) && Array.isArray(remote)) {
      return [...new Map([...local, ...remote].map((item: any) => [item.id, item])).values()]
    }
    return { ...remote, ...local }
  }

  private async fetchRemoteData(key: string): Promise<any> {
    try {
      const response = await fetch(`/api/sync/${key}`)
      if (response.ok) {
        return await response.json()
      }
    } catch (error) {
      console.error('[v0] Fetch remote error:', error)
    }
    return null
  }

  private async processSyncQueue(): Promise<void> {
    if (!navigator.onLine) return

    for (const item of this.syncQueue) {
      await this.processSync(item.key, item.data, item.timestamp)
    }
    this.syncQueue = []
  }

  private updateMetadata(key: string, updates: Partial<SyncMetadata>): void {
    const current = this.metadata.get(key) || {
      lastSyncTime: 0,
      lastModified: 0,
      syncStatus: 'pending' as const,
      deviceId: this.deviceId,
      version: 1,
    }
    this.metadata.set(key, { ...current, ...updates })
  }

  subscribe(listener: (data: any) => void): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  private notifyListeners(data: any): void {
    this.listeners.forEach(listener => listener(data))
  }

  private handleOnline(): void {
    console.log('[v0] Device online - resuming sync')
    this.processSyncQueue()
  }

  private handleOffline(): void {
    console.log('[v0] Device offline - queuing for sync')
  }

  getMetadata(key: string): SyncMetadata | undefined {
    return this.metadata.get(key)
  }

  getAllMetadata(): Record<string, SyncMetadata> {
    const result: Record<string, SyncMetadata> = {}
    this.metadata.forEach((value, key) => {
      result[key] = value
    })
    return result
  }
}

export const syncManager = new RealtimeSyncManager({
  provider: 'hybrid',
  autoSync: true,
  syncInterval: 30000,
})
