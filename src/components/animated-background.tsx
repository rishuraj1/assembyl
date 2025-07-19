"use client"

import { useEffect, useRef } from "react"

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Neural network node
    class NeuralNode {
      x: number
      y: number
      vx: number
      vy: number
      size: number
      opacity: number
      pulse: number
      pulseSpeed: number

      constructor() {
        this.x = Math.random() * (canvas?.width || 800)
        this.y = Math.random() * (canvas?.height || 600)
        this.vx = (Math.random() - 0.5) * 0.3
        this.vy = (Math.random() - 0.5) * 0.3
        this.size = Math.random() * 4 + 2
        this.opacity = Math.random() * 0.6 + 0.2
        this.pulse = Math.random() * Math.PI * 2
        this.pulseSpeed = Math.random() * 0.02 + 0.01
      }

      update() {
        this.x += this.vx
        this.y += this.vy
        this.pulse += this.pulseSpeed

        if (this.x < 0 || this.x > (canvas?.width || 800)) this.vx *= -1
        if (this.y < 0 || this.y > (canvas?.height || 600)) this.vy *= -1
      }

      draw() {
        if (!ctx) return
        
        const pulseSize = this.size + Math.sin(this.pulse) * 2
        const pulseOpacity = this.opacity + Math.sin(this.pulse) * 0.2

        ctx.save()
        ctx.globalAlpha = pulseOpacity
        ctx.fillStyle = `hsl(${200 + Math.random() * 60}, 70%, 60%)`
        ctx.beginPath()
        ctx.arc(this.x, this.y, pulseSize, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }
    }

    // Data flow particle
    class DataParticle {
      x: number
      y: number
      targetX: number
      targetY: number
      speed: number
      size: number
      opacity: number
      trail: Array<{ x: number; y: number; opacity: number }>

      constructor() {
        this.x = Math.random() * (canvas?.width || 800)
        this.y = Math.random() * (canvas?.height || 600)
        this.targetX = Math.random() * (canvas?.width || 800)
        this.targetY = Math.random() * (canvas?.height || 600)
        this.speed = Math.random() * 2 + 1
        this.size = Math.random() * 3 + 1
        this.opacity = Math.random() * 0.8 + 0.2
        this.trail = []
      }

      update() {
        // Move towards target
        const dx = this.targetX - this.x
        const dy = this.targetY - this.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance > 5) {
          this.x += (dx / distance) * this.speed
          this.y += (dy / distance) * this.speed
        } else {
          // Set new target
          this.targetX = Math.random() * (canvas?.width || 800)
          this.targetY = Math.random() * (canvas?.height || 600)
        }

        // Update trail
        this.trail.push({ x: this.x, y: this.y, opacity: this.opacity })
        if (this.trail.length > 10) {
          this.trail.shift()
        }
      }

      draw() {
        if (!ctx) return
        
        // Draw trail
        this.trail.forEach((point, index) => {
          const trailOpacity = (point.opacity * index) / this.trail.length
          ctx.save()
          ctx.globalAlpha = trailOpacity
          ctx.fillStyle = `hsl(${180 + Math.random() * 40}, 80%, 70%)`
          ctx.beginPath()
          ctx.arc(point.x, point.y, this.size * 0.5, 0, Math.PI * 2)
          ctx.fill()
          ctx.restore()
        })

        // Draw particle
        ctx.save()
        ctx.globalAlpha = this.opacity
        ctx.fillStyle = `hsl(${180 + Math.random() * 40}, 80%, 70%)`
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }
    }

    // Gradient orb
    class GradientOrb {
      x: number
      y: number
      radius: number
      vx: number
      vy: number
      opacity: number
      rotation: number
      rotationSpeed: number

      constructor() {
        this.x = Math.random() * (canvas?.width || 800)
        this.y = Math.random() * (canvas?.height || 600)
        this.radius = Math.random() * 300 + 150
        this.vx = (Math.random() - 0.5) * 0.2
        this.vy = (Math.random() - 0.5) * 0.2
        this.opacity = Math.random() * 0.08 + 0.03
        this.rotation = Math.random() * Math.PI * 2
        this.rotationSpeed = (Math.random() - 0.5) * 0.01
      }

      update() {
        this.x += this.vx
        this.y += this.vy
        this.rotation += this.rotationSpeed

        if (this.x < -this.radius || this.x > (canvas?.width || 800) + this.radius) this.vx *= -1
        if (this.y < -this.radius || this.y > (canvas?.height || 600) + this.radius) this.vy *= -1
      }

      draw() {
        if (!ctx) return
        
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.radius
        )
        gradient.addColorStop(0, `rgba(59, 130, 246, ${this.opacity})`)
        gradient.addColorStop(0.3, `rgba(147, 51, 234, ${this.opacity * 0.7})`)
        gradient.addColorStop(0.7, `rgba(16, 185, 129, ${this.opacity * 0.3})`)
        gradient.addColorStop(1, `rgba(59, 130, 246, 0)`)

        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(this.rotation)
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }
    }

    // Create elements
    const nodes: NeuralNode[] = Array.from({ length: 30 }, () => new NeuralNode())
    const dataParticles: DataParticle[] = Array.from({ length: 15 }, () => new DataParticle())
    const orbs: GradientOrb[] = Array.from({ length: 2 }, () => new GradientOrb())

    // Animation loop
    let animationId: number
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw orbs first (background)
      orbs.forEach(orb => {
        orb.update()
        orb.draw()
      })

      // Draw neural network connections
      ctx.strokeStyle = "rgba(59, 130, 246, 0.15)"
      ctx.lineWidth = 1

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 120) {
            const opacity = (120 - distance) / 120 * 0.15
            ctx.strokeStyle = `rgba(59, 130, 246, ${opacity})`
            ctx.beginPath()
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.stroke()
          }
        }
      }

      // Draw data particles
      dataParticles.forEach(particle => {
        particle.update()
        particle.draw()
      })

      // Draw neural nodes
      nodes.forEach(node => {
        node.update()
        node.draw()
      })

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: "transparent" }}
    />
  )
} 