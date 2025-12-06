"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Share2, Copy, Check } from 'lucide-react'
import { toast } from "sonner"

interface ShareDrawerProps {
  title: string
  url: string
}

export function ShareDrawer({ title, url }: ShareDrawerProps) {
  const [copied, setCopied] = useState(false)

  const encodedText = encodeURIComponent(`Check out "${title}" on our Digital Library!\n${url}`)
  
  const shareLinks = [
    {
      name: "WhatsApp",
      icon: "/assets/whatsapp.svg",
      url: `https://wa.me/?text=${encodedText}`,
      className: "bg-[#25D366] hover:bg-[#128C7E]"
    },
    {
      name: "LINE",
      icon: "/assets/line.svg",
      url: `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}`,
      className: "bg-[#00B900] hover:bg-[#009900]"
    },
    {
      name: "X",
      icon: "/assets/x.svg",
      url: `https://x.com/intent/tweet?text=${encodedText}`,
      className: "bg-black hover:bg-gray-800"
    },
    {
      name: "Instagram",
      icon: "/assets/instagram.svg",
      url: `instagram://library`,
      className: "bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hover:opacity-90"
    }
  ]

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      toast.success("Link copied to clipboard!")
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast.error("Failed to copy link")
    }
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" size="icon">
          <Share2 className="h-4 w-4 text-gray-500" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Share this book</DrawerTitle>
            <DrawerDescription>Choose how you want to share this book</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <div className="grid grid-cols-4 gap-4">
              {shareLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex flex-col items-center justify-center p-4 rounded-lg text-white transition-all ${link.className}`}
                >
                  <img src={link.icon} alt={link.name} className="w-8 h-8 mb-2" />
                  <span className="text-xs font-medium">{link.name}</span>
                </a>
              ))}
            </div>
            <div className="relative mt-4">
              <input
                type="text"
                value={url}
                readOnly
                className="w-full p-3 pr-20 text-sm border rounded-lg bg-muted"
              />
              <Button
                size="sm"
                variant="ghost"
                className="absolute right-1 top-1"
                onClick={copyToClipboard}
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

