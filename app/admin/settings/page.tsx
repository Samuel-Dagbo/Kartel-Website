'use client';
import { useEffect, useState } from 'react';
import { useSettings } from '@/hooks/useSettings';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

export default function SettingsPage() {
  const [settings, setSettings] = useState({});
  const loading = useSettings((s) => s.loading);
  const saved = useSettings((s) => s.saved);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(r => r.json())
      .then(setSettings);
  }, []);

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    fetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value })
    }).then(() => setSaved(true));
  };

  if (loading) return <div>Loading settings...</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Store Settings</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Brand Name */}
        <div>
          <label className="block font-medium mb-1">Brand Name</label>
          <Input
            type="text"
            value={settings.brandName || ''}
            onChange={e => updateSetting('brandName', e.target.value)}
          />
        </div>
        {/* Theme */}
        <div>
          <label className="block font-medium mb-1">Theme</label>
          <Select
            value={settings.theme || 'dark'}
            onChange={e => updateSetting('theme', e.target.value)}
            className="block w-full"
            options={[{ label: 'Dark', value: 'dark' }, { label: 'Light', value: 'light' }]}
          />
        </div>
        {/* Primary Color */}
        <div>
          <label className="block font-medium mb-1">Accent Color</label>
          <Input
            type="text"
            placeholder="#fbbf24"
            value={settings.accentColor || '#fbbf24'}
            onChange={e => updateSetting('accentColor', e.target.value)}
          />
        </div>
        {/* Save */}
        <div className="flex justify-end mt-4">
          <Button onClick={() => updateSetting('brandName', settings.brandName || '')}>
            Save Changes
          </Button>
        </div>
      </div>
      {saved && <div className="mt-4 text-green-600">Settings saved!</div>}
    </div>
  );
}