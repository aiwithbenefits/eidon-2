"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Plus, Trash, Eye, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"

interface ExclusionRule {
  id: string
  type: "app" | "title" | "url" | "pattern"
  value: string
  description?: string
}

export default function ExclusionsPage() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState<"app" | "title" | "url" | "pattern">("app")
  const [newRule, setNewRule] = useState<Partial<ExclusionRule>>({
    type: activeTab,
    value: "",
    description: "",
  })

  const [exclusionRules, setExclusionRules] = useState<ExclusionRule[]>([
    {
      id: "1",
      type: "app",
      value: "System Preferences",
      description: "Skip system settings app",
    },
    {
      id: "2",
      type: "app",
      value: "1Password",
      description: "Skip password manager",
    },
    {
      id: "3",
      type: "title",
      value: "Bank",
      description: "Skip windows with 'Bank' in the title",
    },
    {
      id: "4",
      type: "title",
      value: "Password",
      description: "Skip windows with 'Password' in the title",
    },
    {
      id: "5",
      type: "url",
      value: "bank",
      description: "Skip URLs containing 'bank'",
    },
    {
      id: "6",
      type: "url",
      value: "account",
      description: "Skip URLs containing 'account'",
    },
    {
      id: "7",
      type: "pattern",
      value: "^https://mail\\..*",
      description: "Skip all webmail services",
    },
  ])

  const handleAddRule = () => {
    if (!newRule.value) {
      toast({
        title: "Error",
        description: "Please enter a value for the exclusion rule.",
        variant: "destructive",
      })
      return
    }

    const rule: ExclusionRule = {
      id: Date.now().toString(),
      type: activeTab,
      value: newRule.value,
      description: newRule.description,
    }

    setExclusionRules([...exclusionRules, rule])
    setNewRule({
      type: activeTab,
      value: "",
      description: "",
    })

    toast({
      title: "Rule added",
      description: `Added exclusion rule for ${rule.value}`,
    })
  }

  const handleDeleteRule = (id: string) => {
    setExclusionRules(exclusionRules.filter((rule) => rule.id !== id))

    toast({
      title: "Rule deleted",
      description: "Exclusion rule has been removed.",
    })
  }

  const filteredRules = exclusionRules.filter((rule) => rule.type === activeTab)

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="flex items-center gap-2">
            <Link href="/settings">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Button>
            </Link>
            <div className="flex items-center gap-2 font-semibold">
              <Eye className="h-5 w-5" />
              <span>Manage Exclusions</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="container py-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-medium">Exclusion Rules</h2>
              <p className="text-sm text-muted-foreground">
                Configure what Eidon should not capture to protect your privacy.
              </p>
            </div>

            <Tabs
              value={activeTab}
              onValueChange={(value) => {
                setActiveTab(value as "app" | "title" | "url" | "pattern")
                setNewRule({ ...newRule, type: value as "app" | "title" | "url" | "pattern" })
              }}
              className="space-y-4"
            >
              <TabsList>
                <TabsTrigger value="app">Applications</TabsTrigger>
                <TabsTrigger value="title">Window Titles</TabsTrigger>
                <TabsTrigger value="url">URLs</TabsTrigger>
                <TabsTrigger value="pattern">Regex Patterns</TabsTrigger>
              </TabsList>

              <TabsContent value="app" className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="grid flex-1 gap-2">
                    <Input
                      placeholder="Enter application name (e.g., 'Terminal')"
                      value={newRule.value}
                      onChange={(e) => setNewRule({ ...newRule, value: e.target.value })}
                    />
                    <Input
                      placeholder="Description (optional)"
                      value={newRule.description}
                      onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
                    />
                  </div>
                  <Button onClick={handleAddRule}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Rule
                  </Button>
                </div>

                <Separator />

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Application Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRules.length > 0 ? (
                        filteredRules.map((rule) => (
                          <TableRow key={rule.id}>
                            <TableCell className="font-medium">{rule.value}</TableCell>
                            <TableCell>{rule.description}</TableCell>
                            <TableCell>
                              <Button variant="ghost" size="icon" onClick={() => handleDeleteRule(rule.id)}>
                                <Trash className="h-4 w-4 text-destructive" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={3} className="h-24 text-center">
                            No application exclusion rules.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                <div className="rounded-md border bg-muted/40 p-4">
                  <div className="flex items-start gap-2">
                    <Filter className="mt-0.5 h-4 w-4 text-muted-foreground" />
                    <div className="space-y-1">
                      <h3 className="text-sm font-medium">About Application Exclusions</h3>
                      <p className="text-sm text-muted-foreground">
                        When an excluded application is active, Eidon will not capture any screenshots. This is useful
                        for privacy-sensitive applications like password managers.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="title" className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="grid flex-1 gap-2">
                    <Input
                      placeholder="Enter window title keyword (e.g., 'Private')"
                      value={newRule.value}
                      onChange={(e) => setNewRule({ ...newRule, value: e.target.value })}
                    />
                    <Input
                      placeholder="Description (optional)"
                      value={newRule.description}
                      onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
                    />
                  </div>
                  <Button onClick={handleAddRule}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Rule
                  </Button>
                </div>

                <Separator />

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Window Title Keyword</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRules.length > 0 ? (
                        filteredRules.map((rule) => (
                          <TableRow key={rule.id}>
                            <TableCell className="font-medium">{rule.value}</TableCell>
                            <TableCell>{rule.description}</TableCell>
                            <TableCell>
                              <Button variant="ghost" size="icon" onClick={() => handleDeleteRule(rule.id)}>
                                <Trash className="h-4 w-4 text-destructive" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={3} className="h-24 text-center">
                            No window title exclusion rules.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                <div className="rounded-md border bg-muted/40 p-4">
                  <div className="flex items-start gap-2">
                    <Filter className="mt-0.5 h-4 w-4 text-muted-foreground" />
                    <div className="space-y-1">
                      <h3 className="text-sm font-medium">About Window Title Exclusions</h3>
                      <p className="text-sm text-muted-foreground">
                        When a window's title contains any of these keywords, Eidon will not capture it. This works
                        across all applications and is case-insensitive.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="url" className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="grid flex-1 gap-2">
                    <Input
                      placeholder="Enter URL keyword (e.g., 'banking')"
                      value={newRule.value}
                      onChange={(e) => setNewRule({ ...newRule, value: e.target.value })}
                    />
                    <Input
                      placeholder="Description (optional)"
                      value={newRule.description}
                      onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
                    />
                  </div>
                  <Button onClick={handleAddRule}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Rule
                  </Button>
                </div>

                <Separator />

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>URL Keyword</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRules.length > 0 ? (
                        filteredRules.map((rule) => (
                          <TableRow key={rule.id}>
                            <TableCell className="font-medium">{rule.value}</TableCell>
                            <TableCell>{rule.description}</TableCell>
                            <TableCell>
                              <Button variant="ghost" size="icon" onClick={() => handleDeleteRule(rule.id)}>
                                <Trash className="h-4 w-4 text-destructive" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={3} className="h-24 text-center">
                            No URL exclusion rules.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                <div className="rounded-md border bg-muted/40 p-4">
                  <div className="flex items-start gap-2">
                    <Filter className="mt-0.5 h-4 w-4 text-muted-foreground" />
                    <div className="space-y-1">
                      <h3 className="text-sm font-medium">About URL Exclusions</h3>
                      <p className="text-sm text-muted-foreground">
                        When a browser URL contains any of these keywords, Eidon will not capture it. This only works
                        for supported browsers where URL detection is possible.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="pattern" className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="grid flex-1 gap-2">
                    <Input
                      placeholder="Enter regex pattern (e.g., '^https://mail\\.')"
                      value={newRule.value}
                      onChange={(e) => setNewRule({ ...newRule, value: e.target.value })}
                    />
                    <Input
                      placeholder="Description (optional)"
                      value={newRule.description}
                      onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
                    />
                  </div>
                  <Button onClick={handleAddRule}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Rule
                  </Button>
                </div>

                <Separator />

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Regex Pattern</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRules.length > 0 ? (
                        filteredRules.map((rule) => (
                          <TableRow key={rule.id}>
                            <TableCell className="font-medium">{rule.value}</TableCell>
                            <TableCell>{rule.description}</TableCell>
                            <TableCell>
                              <Button variant="ghost" size="icon" onClick={() => handleDeleteRule(rule.id)}>
                                <Trash className="h-4 w-4 text-destructive" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={3} className="h-24 text-center">
                            No regex pattern exclusion rules.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                <div className="rounded-md border bg-muted/40 p-4">
                  <div className="flex items-start gap-2">
                    <Filter className="mt-0.5 h-4 w-4 text-muted-foreground" />
                    <div className="space-y-1">
                      <h3 className="text-sm font-medium">About Regex Pattern Exclusions</h3>
                      <p className="text-sm text-muted-foreground">
                        Advanced exclusion rules using regular expressions. These can match against application names,
                        window titles, and URLs for more precise control.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  )
}
