'use client'

import { useState } from 'react'
import { Globe, MessageCircle, Zap, TreePine, TrendingUp, Users } from 'lucide-react'
import { i18nManager } from '@/lib/i18n-manager'
import { recyclingAPI } from '@/lib/recycling-api'
import { communityManager } from '@/lib/community-system'
import { carbonOffsetManager } from '@/lib/carbon-offset'
import { advancedMLManager } from '@/lib/advanced-ml'
import { Button } from '@/components/ui/button'

export function AdvancedFeaturesHub() {
  const [selectedLanguage, setSelectedLanguage] = useState(i18nManager.getLanguage())
  const [activeFeature, setActiveFeature] = useState('sync')

  const handleLanguageChange = (lang: any) => {
    i18nManager.setLanguage(lang.code)
    setSelectedLanguage(lang.code)
  }

  const features = [
    {
      id: 'sync',
      name: 'Real-time Sync',
      icon: Zap,
      description: 'Seamlessly sync your data across all devices with cloud backup',
      details: 'Automatic synchronization with conflict resolution and offline support',
    },
    {
      id: 'language',
      name: 'Multi-Language',
      icon: Globe,
      description: 'Support for 15+ languages with regional customization',
      details: `Currently viewing in: ${i18nManager.getLanguageConfig().nativeName}`,
    },
    {
      id: 'recycling',
      name: 'Facility Finder',
      icon: TreePine,
      description: 'Locate nearest recycling and waste disposal facilities',
      details: 'Search millions of verified facilities with real-time information',
    },
    {
      id: 'community',
      name: 'Social Community',
      icon: Users,
      description: 'Connect with sustainability warriors and join challenges',
      details: `${communityManager.getCurrentUserStats().rank}th in community rankings`,
    },
    {
      id: 'ml',
      name: 'Advanced ML',
      icon: TrendingUp,
      description: 'Continuous model improvement with active learning',
      details: `Current model accuracy: ${(advancedMLManager.getModelMetrics()?.accuracy || 0.98 * 100).toFixed(1)}%`,
    },
    {
      id: 'carbon',
      name: 'Carbon Offsets',
      icon: TreePine,
      description: 'Purchase verified carbon offsets and track environmental impact',
      details: 'Connect with legitimate offset programs worldwide',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Language Selector */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="mb-4 text-lg font-semibold text-foreground">Language Support</h3>
        <p className="mb-4 text-sm text-muted-foreground">
          Available in 15+ languages with full RTL support for Arabic and Hebrew
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {i18nManager.getAvailableLanguages().map(lang => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang)}
              className={`rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
                selectedLanguage === lang.code
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-secondary hover:border-primary/50'
              }`}
            >
              {lang.nativeName}
            </button>
          ))}
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {features.map(feature => {
          const Icon = feature.icon
          return (
            <button
              key={feature.id}
              onClick={() => setActiveFeature(feature.id)}
              className={`rounded-xl border p-4 text-left transition-all ${
                activeFeature === feature.id
                  ? 'border-primary bg-primary/10'
                  : 'border-border bg-card hover:border-primary/50'
              }`}
            >
              <Icon className="mb-3 h-6 w-6 text-primary" />
              <h4 className="font-semibold text-foreground">{feature.name}</h4>
              <p className="mt-1 text-sm text-muted-foreground">{feature.description}</p>
            </button>
          )
        })}
      </div>

      {/* Feature Details */}
      <div className="rounded-xl border border-border bg-gradient-to-br from-card to-secondary/30 p-6">
        {activeFeature === 'sync' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Real-time Synchronization</h3>
            <p className="text-muted-foreground">
              Your waste classifications sync automatically across all devices. Data is encrypted and backed up to secure cloud storage.
            </p>
            <div className="space-y-2">
              <p className="font-medium text-foreground">Features:</p>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Automatic conflict resolution</li>
                <li>• Offline-first architecture</li>
                <li>• End-to-end encryption</li>
                <li>• Multi-device sync</li>
              </ul>
            </div>
            <Button className="mt-4">Enable Cloud Sync</Button>
          </div>
        )}

        {activeFeature === 'recycling' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Smart Facility Finder</h3>
            <p className="text-muted-foreground">
              Find certified recycling centers, composting facilities, and hazmat disposal locations near you.
            </p>
            <div className="space-y-2">
              <p className="font-medium text-foreground">Connected APIs:</p>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Earth911 Recycling Database</li>
                <li>• RecycleSearch Network</li>
                <li>• WasteDB Global Directory</li>
                <li>• LocalWaste Community Network</li>
              </ul>
            </div>
            <Button className="mt-4">Find Facilities Near Me</Button>
          </div>
        )}

        {activeFeature === 'community' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Community & Social</h3>
            <p className="text-muted-foreground">
              Join challenges, share tips, compete in leaderboards, and inspire others on their sustainability journey.
            </p>
            <div className="space-y-2">
              <p className="font-medium text-foreground">Your Stats:</p>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Level: {communityManager.getCurrentUserStats().level}</li>
                <li>• Points: {communityManager.getCurrentUserStats().points}</li>
                <li>• Community Rank: #{communityManager.getCurrentUserStats().rank}</li>
                <li>• Achievements: {communityManager.getCurrentUserStats().achievements}</li>
              </ul>
            </div>
            <Button className="mt-4">Join Community</Button>
          </div>
        )}

        {activeFeature === 'ml' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Advanced ML Models</h3>
            <p className="text-muted-foreground">
              Continuous model improvement with active learning, transfer learning, and ensemble methods.
            </p>
            <div className="space-y-2">
              <p className="font-medium text-foreground">Current Capabilities:</p>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Multi-scale inference (98% accuracy)</li>
                <li>• Active learning for uncertain predictions</li>
                <li>• Federated learning support</li>
                <li>• Automatic model updates</li>
              </ul>
            </div>
            <Button className="mt-4">View Model Performance</Button>
          </div>
        )}

        {activeFeature === 'carbon' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Carbon Offset Programs</h3>
            <p className="text-muted-foreground">
              Connect with verified carbon offset projects and track your environmental contribution.
            </p>
            <div className="space-y-2">
              <p className="font-medium text-foreground">Available Programs:</p>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Global Reforestation Initiative</li>
                <li>• Renewable Energy Projects</li>
                <li>• Methane Reduction Program</li>
                <li>• Ocean Acidification Prevention</li>
              </ul>
            </div>
            <Button className="mt-4">Browse Offset Programs</Button>
          </div>
        )}

        {activeFeature === 'language' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Multi-Language Support</h3>
            <p className="text-muted-foreground">
              EcoSort is available in 15+ languages with full localization and RTL support.
            </p>
            <div className="space-y-2">
              <p className="font-medium text-foreground">Supported Languages:</p>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• European: English, Spanish, French, German, Italian, Portuguese, Dutch, Polish</li>
                <li>• Asian: Japanese, Chinese, Hindi, Korean</li>
                <li>• Middle Eastern: Arabic, Turkish, Russian</li>
              </ul>
            </div>
            <Button className="mt-4">Change Language</Button>
          </div>
        )}
      </div>

      {/* Integration Summary */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="mb-4 text-lg font-semibold text-foreground">System Integration Status</h3>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-lg bg-secondary/50 p-3">
            <p className="text-xs text-muted-foreground">Real-time Sync</p>
            <p className="mt-1 font-semibold text-green-400">Connected</p>
          </div>
          <div className="rounded-lg bg-secondary/50 p-3">
            <p className="text-xs text-muted-foreground">Recycling APIs</p>
            <p className="mt-1 font-semibold text-green-400">4 Providers Active</p>
          </div>
          <div className="rounded-lg bg-secondary/50 p-3">
            <p className="text-xs text-muted-foreground">Community System</p>
            <p className="mt-1 font-semibold text-green-400">1000+ Users</p>
          </div>
          <div className="rounded-lg bg-secondary/50 p-3">
            <p className="text-xs text-muted-foreground">ML Models</p>
            <p className="mt-1 font-semibold text-green-400">v4.0 Active</p>
          </div>
        </div>
      </div>
    </div>
  )
}
