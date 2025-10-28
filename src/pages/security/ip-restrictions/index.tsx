import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Globe, Shield, Ban, CheckCircle, Plus, Trash2, Save, MapPin, Clock, AlertTriangle } from "lucide-react"

export default function IpRestrictionsPage() {
  const [settings, setSettings] = React.useState({
    // Global Settings
    ipRestrictionsEnabled: true,
    defaultAction: "allow",
    logBlockedAttempts: true,
    geoBlockingEnabled: false,
    
    // Rate Limiting
    rateLimitingEnabled: true,
    requestsPerMinute: 60,
    burstLimit: 100,
    
    // Whitelist/Blacklist
    whitelistEnabled: true,
    blacklistEnabled: true,
    
    // Geo-blocking
    blockedCountries: ["CN", "RU", "KP"],
    allowedCountries: [],
    
    // Advanced
    proxyDetectionEnabled: true,
    vpnDetectionEnabled: true,
    torDetectionEnabled: true,
    cloudProviderBlocking: false
  })

  const [newIpRule, setNewIpRule] = React.useState({
    type: "whitelist",
    ip: "",
    description: ""
  })

  const [ipRules, setIpRules] = React.useState([
    { id: 1, type: "whitelist", ip: "192.168.1.0/24", description: "Office network", createdAt: "2024-01-15" },
    { id: 2, type: "whitelist", ip: "10.0.0.0/8", description: "VPN range", createdAt: "2024-01-10" },
    { id: 3, type: "blacklist", ip: "203.0.113.0/24", description: "Suspicious range", createdAt: "2024-01-20" },
    { id: 4, type: "blacklist", ip: "198.51.100.42", description: "Known attacker", createdAt: "2024-01-18" }
  ])

  const handleSave = () => {
    console.log("Saving IP restrictions settings:", settings)
    // TODO: Implement save functionality
  }

  const addIpRule = () => {
    if (newIpRule.ip.trim()) {
      const rule = {
        id: Date.now(),
        ...newIpRule,
        createdAt: new Date().toISOString().split('T')[0]
      }
      setIpRules(prev => [...prev, rule])
      setNewIpRule({ type: "whitelist", ip: "", description: "" })
    }
  }

  const removeIpRule = (id: number) => {
    setIpRules(prev => prev.filter(rule => rule.id !== id))
  }

  const countries = [
    { code: "CN", name: "China" },
    { code: "RU", name: "Russia" },
    { code: "KP", name: "North Korea" },
    { code: "IR", name: "Iran" },
    { code: "US", name: "United States" },
    { code: "GB", name: "United Kingdom" },
    { code: "DE", name: "Germany" },
    { code: "FR", name: "France" },
    { code: "JP", name: "Japan" },
    { code: "AU", name: "Australia" }
  ]

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight">IP Restrictions</h1>
          <p className="text-muted-foreground">
            Configure IP-based access controls, geo-blocking, and rate limiting to protect against unauthorized access and attacks.
          </p>
        </div>

        <div className="grid gap-6">
          {/* Global Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Global Settings
              </CardTitle>
              <CardDescription>
                Configure global IP restriction policies and default behaviors
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm">Enable IP restrictions</Label>
                    <div className="text-xs text-muted-foreground">Activate IP-based access control</div>
                  </div>
                  <Switch
                    checked={settings.ipRestrictionsEnabled}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, ipRestrictionsEnabled: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm">Log blocked attempts</Label>
                    <div className="text-xs text-muted-foreground">Record all blocked IP attempts</div>
                  </div>
                  <Switch
                    checked={settings.logBlockedAttempts}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, logBlockedAttempts: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm">Enable geo-blocking</Label>
                    <div className="text-xs text-muted-foreground">Block/allow by country</div>
                  </div>
                  <Switch
                    checked={settings.geoBlockingEnabled}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, geoBlockingEnabled: checked }))}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="defaultAction" className="text-sm font-medium">
                  Default action for unlisted IPs
                </Label>
                <Select
                  value={settings.defaultAction}
                  onValueChange={(value) => setSettings(prev => ({ ...prev, defaultAction: value }))}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="allow">Allow access</SelectItem>
                    <SelectItem value="block">Block access</SelectItem>
                    <SelectItem value="challenge">Challenge with CAPTCHA</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Rate Limiting */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Rate Limiting
              </CardTitle>
              <CardDescription>
                Configure request rate limits to prevent abuse and DDoS attacks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm">Enable rate limiting</Label>
                  <div className="text-xs text-muted-foreground">Limit requests per IP address</div>
                </div>
                <Switch
                  checked={settings.rateLimitingEnabled}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, rateLimitingEnabled: checked }))}
                />
              </div>

              {settings.rateLimitingEnabled && (
                <div className="grid gap-4 pl-4 border-l-2 border-muted sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="requestsPerMinute" className="text-sm font-medium">
                      Requests per minute
                    </Label>
                    <Input
                      id="requestsPerMinute"
                      type="number"
                      value={settings.requestsPerMinute}
                      onChange={(e) => setSettings(prev => ({ ...prev, requestsPerMinute: parseInt(e.target.value) || 0 }))}
                      min="1"
                      max="1000"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="burstLimit" className="text-sm font-medium">
                      Burst limit
                    </Label>
                    <Input
                      id="burstLimit"
                      type="number"
                      value={settings.burstLimit}
                      onChange={(e) => setSettings(prev => ({ ...prev, burstLimit: parseInt(e.target.value) || 0 }))}
                      min="1"
                      max="1000"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* IP Whitelist/Blacklist */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                IP Allow/Block Lists
              </CardTitle>
              <CardDescription>
                Manage specific IP addresses and ranges for access control
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm">Enable allow list</Label>
                    <div className="text-xs text-muted-foreground">Explicitly allow specific IPs</div>
                  </div>
                  <Switch
                    checked={settings.whitelistEnabled}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, whitelistEnabled: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm">Enable block list</Label>
                    <div className="text-xs text-muted-foreground">Explicitly block specific IPs</div>
                  </div>
                  <Switch
                    checked={settings.blacklistEnabled}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, blacklistEnabled: checked }))}
                  />
                </div>
              </div>

              {/* Add New IP Rule */}
              <div className="border rounded-lg p-4 space-y-3">
                <Label className="text-sm font-medium">Add IP Rule</Label>
                <div className="grid gap-3 sm:grid-cols-4">
                  <Select
                    value={newIpRule.type}
                    onValueChange={(value) => setNewIpRule(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="whitelist">Allow</SelectItem>
                      <SelectItem value="blacklist">Block</SelectItem>
                    </SelectContent>
                  </Select>

                  <Input
                    placeholder="IP address or CIDR"
                    value={newIpRule.ip}
                    onChange={(e) => setNewIpRule(prev => ({ ...prev, ip: e.target.value }))}
                  />

                  <Input
                    placeholder="Description"
                    value={newIpRule.description}
                    onChange={(e) => setNewIpRule(prev => ({ ...prev, description: e.target.value }))}
                  />

                  <Button onClick={addIpRule} className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Add
                  </Button>
                </div>
              </div>

              {/* IP Rules List */}
              <div className="space-y-2">
                {ipRules.map((rule) => (
                  <div key={rule.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant={rule.type === "whitelist" ? "default" : "destructive"}>
                        {rule.type === "whitelist" ? (
                          <CheckCircle className="mr-1 h-3 w-3" />
                        ) : (
                          <Ban className="mr-1 h-3 w-3" />
                        )}
                        {rule.type === "whitelist" ? "Allow" : "Block"}
                      </Badge>
                      <div>
                        <div className="font-mono text-sm">{rule.ip}</div>
                        <div className="text-xs text-muted-foreground">{rule.description}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{rule.createdAt}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeIpRule(rule.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Geo-blocking */}
          {settings.geoBlockingEnabled && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Geographic Restrictions
                </CardTitle>
                <CardDescription>
                  Block or allow access based on geographic location
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Blocked Countries</Label>
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2">
                        {settings.blockedCountries.map((countryCode) => {
                          const country = countries.find(c => c.code === countryCode)
                          return (
                            <Badge key={countryCode} variant="destructive" className="cursor-pointer"
                              onClick={() => {
                                setSettings(prev => ({
                                  ...prev,
                                  blockedCountries: prev.blockedCountries.filter(c => c !== countryCode)
                                }))
                              }}
                            >
                              <Ban className="mr-1 h-3 w-3" />
                              {country?.name || countryCode}
                            </Badge>
                          )
                        })}
                      </div>
                      <Select
                        onValueChange={(value) => {
                          if (!settings.blockedCountries.includes(value)) {
                            setSettings(prev => ({
                              ...prev,
                              blockedCountries: [...prev.blockedCountries, value]
                            }))
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Add blocked country" />
                        </SelectTrigger>
                        <SelectContent>
                          {countries
                            .filter(country => !settings.blockedCountries.includes(country.code))
                            .map((country) => (
                              <SelectItem key={country.code} value={country.code}>
                                {country.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Allowed Countries (Optional)</Label>
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2">
                        {settings.allowedCountries.map((countryCode) => {
                          const country = countries.find(c => c.code === countryCode)
                          return (
                            <Badge key={countryCode} variant="default" className="cursor-pointer"
                              onClick={() => {
                                setSettings(prev => ({
                                  ...prev,
                                  allowedCountries: prev.allowedCountries.filter(c => c !== countryCode)
                                }))
                              }}
                            >
                              <CheckCircle className="mr-1 h-3 w-3" />
                              {country?.name || countryCode}
                            </Badge>
                          )
                        })}
                      </div>
                      <Select
                        onValueChange={(value) => {
                          if (!settings.allowedCountries.includes(value)) {
                            setSettings(prev => ({
                              ...prev,
                              allowedCountries: [...prev.allowedCountries, value]
                            }))
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Add allowed country" />
                        </SelectTrigger>
                        <SelectContent>
                          {countries
                            .filter(country => !settings.allowedCountries.includes(country.code))
                            .map((country) => (
                              <SelectItem key={country.code} value={country.code}>
                                {country.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Advanced Detection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Advanced Detection
              </CardTitle>
              <CardDescription>
                Detect and block proxy, VPN, and anonymization services
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm">Proxy detection</Label>
                    <div className="text-xs text-muted-foreground">Block known proxy servers</div>
                  </div>
                  <Switch
                    checked={settings.proxyDetectionEnabled}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, proxyDetectionEnabled: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm">VPN detection</Label>
                    <div className="text-xs text-muted-foreground">Block VPN exit nodes</div>
                  </div>
                  <Switch
                    checked={settings.vpnDetectionEnabled}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, vpnDetectionEnabled: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm">Tor detection</Label>
                    <div className="text-xs text-muted-foreground">Block Tor exit nodes</div>
                  </div>
                  <Switch
                    checked={settings.torDetectionEnabled}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, torDetectionEnabled: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm">Cloud provider blocking</Label>
                    <div className="text-xs text-muted-foreground">Block cloud hosting IPs</div>
                  </div>
                  <Switch
                    checked={settings.cloudProviderBlocking}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, cloudProviderBlocking: checked }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* IP Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                IP Access Statistics
              </CardTitle>
              <CardDescription>
                Current IP restriction metrics and activity overview
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-green-600">1,247</div>
                  <div className="text-sm text-muted-foreground">Allowed IPs Today</div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-red-600">89</div>
                  <div className="text-sm text-muted-foreground">Blocked IPs Today</div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-blue-600">23</div>
                  <div className="text-sm text-muted-foreground">Countries Blocked</div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-orange-600">156</div>
                  <div className="text-sm text-muted-foreground">Rate Limited</div>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium">Recent Activity</Label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center gap-2">
                      <Badge variant="destructive" className="text-xs">
                        <Ban className="mr-1 h-3 w-3" />
                        Blocked
                      </Badge>
                      <span className="font-mono text-sm">203.0.113.42</span>
                      <span className="text-xs text-muted-foreground">China</span>
                    </div>
                    <span className="text-xs text-muted-foreground">2 minutes ago</span>
                  </div>
                  <div className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        <Clock className="mr-1 h-3 w-3" />
                        Rate Limited
                      </Badge>
                      <span className="font-mono text-sm">198.51.100.15</span>
                      <span className="text-xs text-muted-foreground">United States</span>
                    </div>
                    <span className="text-xs text-muted-foreground">5 minutes ago</span>
                  </div>
                  <div className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center gap-2">
                      <Badge variant="default" className="text-xs">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Allowed
                      </Badge>
                      <span className="font-mono text-sm">192.168.1.100</span>
                      <span className="text-xs text-muted-foreground">Office Network</span>
                    </div>
                    <span className="text-xs text-muted-foreground">8 minutes ago</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button onClick={handleSave} className="min-w-[140px] px-6">
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
