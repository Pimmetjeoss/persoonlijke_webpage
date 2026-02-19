"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import {
  Pen,
  PaintBucket,
  Home,
  Ruler,
  PenTool,
  Building2,
  Award,
  Users,
  Calendar,
  CheckCircle,
  Sparkles,
  Star,
  ArrowRight,
  Zap,
  TrendingUp,
} from "lucide-react"
import { motion, useScroll, useTransform, useInView, useSpring } from "framer-motion"

export default function AboutUsSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  const section2Ref = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const stats2Ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: false, amount: 0.1 })
  const isSection2InView = useInView(section2Ref, { once: false, amount: 0.1 })
  const isStatsInView = useInView(statsRef, { once: false, amount: 0.3 })
  const isStats2InView = useInView(stats2Ref, { once: false, amount: 0.3 })

  // Parallax effect for decorative elements
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -50])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 50])
  const rotate1 = useTransform(scrollYProgress, [0, 1], [0, 20])
  const rotate2 = useTransform(scrollYProgress, [0, 1], [0, -20])

  useEffect(() => {
    setIsVisible(true) // eslint-disable-line react-hooks/set-state-in-effect
    setIsMounted(true) // eslint-disable-line react-hooks/set-state-in-effect
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" as const },
    },
  }

  const services = [
    {
      icon: <Pen className="w-6 h-6" />,
      secondaryIcon: <Sparkles className="w-4 h-4 absolute -top-1 -right-1 text-[#A9BBC8]" />,
      title: "Input",
      description:
        "De input kan uit allerlei bronnen komen: emails, chat-applicaties, WhatsApp-berichten. Het mooie is dat het systeem continu \"luistert\" naar al deze kanalen en automatisch reageert zodra er iets binnenkomt - bijvoorbeeld een ziekmelding via mail of een verlofaanvraag via een app.",
      position: "left",
    },
    {
      icon: <Home className="w-6 h-6" />,
      secondaryIcon: <CheckCircle className="w-4 h-4 absolute -top-1 -right-1 text-[#A9BBC8]" />,
      title: "Coordinator",
      description:
        "De Coordinator Agent is de projectmanager die alle taken verdeelt en overzicht houdt. Hij ontvangt de vertaalde taak van de Converter en beslist welke agents er aan de slag moeten en in welke volgorde.",
      position: "left",
    },
    {
      icon: <PenTool className="w-6 h-6" />,
      secondaryIcon: <Star className="w-4 h-4 absolute -top-1 -right-1 text-[#A9BBC8]" />,
      title: "Judge",
      description:
        "De Judge Agent is de kwaliteitscontroleur die checkt of het werk van de andere agents goed genoeg is. Hij controleert of de planning logisch is, of alle regels gevolgd zijn, en of er geen fouten zijn gemaakt. Als iets niet klopt stuurt hij het terug naar de juiste agent met feedback: \"Planning opnieuw maken, Jan heeft te veel uren.\"",
      position: "left",
    },
    {
      icon: <PaintBucket className="w-6 h-6" />,
      secondaryIcon: <Sparkles className="w-4 h-4 absolute -top-1 -right-1 text-[#A9BBC8]" />,
      title: "Converter",
      description:
        "De Converter Agent is als een vertaler die binnenkomende berichten leest (mail, app, WhatsApp) en begrijpt wat de bedoeling is. Hij zet deze berichten om naar een vaste format/taken die de andere agents kunnen begrijpen.",
      position: "right",
    },
    {
      icon: <Ruler className="w-6 h-6" />,
      secondaryIcon: <CheckCircle className="w-4 h-4 absolute -top-1 -right-1 text-[#A9BBC8]" />,
      title: "Agents",
      description:
        "De Agents zijn gespecialiseerde AI-helpers die elk hun eigen taak zorgvuldig uitvoeren, van begin tot eind. Eén agent zoekt vervangers, een ander past het roostersysteem aan, weer een ander stuurt berichten naar medewerkers. Elk doet waar hij goed in is, met aandacht voor regels, beschikbaarheid en voorkeuren, volledig automatisch en zonder menselijke tussenkomst.",
      position: "right",
    },
    {
      icon: <Building2 className="w-6 h-6" />,
      secondaryIcon: <Star className="w-4 h-4 absolute -top-1 -right-1 text-[#A9BBC8]" />,
      title: "Output",
      description:
        "De Output is het eindresultaat dat het systeem oplevert nadat de Judge alles heeft goedgekeurd. Dit kan zijn: de planning staat in je roostersysteem, medewerkers hebben hun diensten ontvangen via WhatsApp, en jij krijgt een samenvatting in je mail. Het systeem heeft de hele workflow afgerond en alles is klaar voor gebruik - van input tot output volledig automatisch.",
      position: "right",
    },
  ]

  const stats = [
    { icon: <Award />, value: 33, label: "Kostenbesparing", suffix: "%" },
    { icon: <Users />, value: 45, label: "Meer werkplezier", suffix: "%" },
    { icon: <Calendar />, value: "24-7", label: "uur per dag", suffix: "" },
    { icon: <TrendingUp />, value: 99, label: "Nauwkeurigheid", suffix: "%" },
  ]

  return (
    <section
      id="about-section"
      ref={sectionRef}
      className="w-full py-24 px-4 bg-gradient-to-b from-[rgb(240,253,244)] to-[rgb(220,252,231)] text-[#202e44] overflow-hidden relative"
    >
      {/* Decorative background elements */}
      <motion.div
        className="absolute top-20 left-10 w-64 h-64 rounded-full bg-[#88734C]/5 blur-3xl"
        style={isMounted ? { y: y1, rotate: rotate1 } : {}}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-[#A9BBC8]/5 blur-3xl"
        style={isMounted ? { y: y2, rotate: rotate2 } : {}}
      />
      <motion.div
        className="absolute top-1/2 left-1/4 w-4 h-4 rounded-full bg-[#88734C]/30"
        animate={{
          y: [0, -15, 0],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-1/3 right-1/4 w-6 h-6 rounded-full bg-[#A9BBC8]/30"
        animate={{
          y: [0, 20, 0],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      <motion.div
        className="container mx-auto max-w-6xl relative z-10"
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        <div className="relative">
          <p className="text-center max-w-2xl mx-auto mb-16" style={{ color: "hsl(144.9 80.4% 10%)", opacity: 0.8 }}>
            99% van de mensen gebruikt AI nog reactief: je typt een vraag, krijgt een antwoord, en klaar. Maar wat als AI proactief wordt? Wat als het zelf problemen oppikt, taken plant en uitvoert zonder dat jij constant hoeft in te grijgen? Dát is de kracht van agentic AI: slimme systemen die niet alleen reageren, maar ook zelf actie ondernemen.
          </p>
          <motion.div
            className="absolute top-1/2 right-0 md:right-20 w-4 h-4 rounded-full bg-[#A9BBC8]/30"
            animate={{
              y: [0, -15, 0],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 3.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 0.5,
            }}
          />
        </div>

        {/* Center Image */}
        <div className="flex justify-center items-center mb-16 mt-8">
          <motion.div className="relative w-full max-w-xs">
            <motion.div
              className="rounded-md overflow-hidden shadow-xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              whileHover={{ scale: 1.03, transition: { duration: 0.3 } }}
            >
              <img
                src="/photo-1747582411588-f9b4acabe995.jpg"
                alt="AI Agents"
                className="w-full h-full object-cover"
              />
            </motion.div>
            <motion.div
              className="absolute inset-0 border-4 border-[#A9BBC8] rounded-md -m-3 z-[-1]"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            ></motion.div>

            {/* Floating accent elements */}
            <motion.div
              className="absolute -top-4 -right-8 w-16 h-16 rounded-full bg-[#88734C]/10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.9 }}
              style={isMounted ? { y: y1 } : {}}
            ></motion.div>
            <motion.div
              className="absolute -bottom-6 -left-10 w-20 h-20 rounded-full bg-[#A9BBC8]/15"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.1 }}
              style={isMounted ? { y: y2 } : {}}
            ></motion.div>

            {/* Additional decorative elements */}
            <motion.div
              className="absolute -top-10 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#88734C]"
              animate={{
                y: [0, -10, 0],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            ></motion.div>
            <motion.div
              className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#A9BBC8]"
              animate={{
                y: [0, 10, 0],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: 0.5,
              }}
            ></motion.div>
          </motion.div>
        </div>

        <motion.div className="flex flex-col items-center mb-6 mt-16" variants={itemVariants}>
          <motion.div
            className="w-24 h-1 bg-[rgb(5,46,22)]"
            initial={{ width: 0 }}
            animate={{ width: 96 }}
            transition={{ duration: 1, delay: 0.5 }}
          ></motion.div>
        </motion.div>

        <p className="text-center max-w-2xl mx-auto mb-16" style={{ color: "hsl(144.9 80.4% 10%)", opacity: 0.8 }}>
          Is een flow waar een werknemer vrijwel niet aan te pas komt. Het systeem draait namelijk op de achtergrond, 24/7. Het maakt de planning, zet hem automatisch in het systeem, stuurt notificaties, en lost ziekmeldingen direct op zonder dat jij er aan te pas komt. Ik maak gebruik van een Multi-Agent System; een algemene term voor systemen met meerdere samenwerkende agents. Deze bestaat uit een 6-tal vaste onderdelen;
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Left Column */}
          <div className="space-y-16">
            {services
              .filter((service) => service.position === "left")
              .map((service, index) => (
                <ServiceItem
                  key={`left-${index}`}
                  icon={service.icon}
                  secondaryIcon={service.secondaryIcon}
                  title={service.title}
                  description={service.description}
                  delay={index * 0.2}
                  direction="left"
                />
              ))}
          </div>

          {/* Center Image */}
          <div className="flex justify-center items-center order-first md:order-none mb-8 md:mb-0">
            <motion.div className="relative w-full max-w-xs">
              <motion.div
                className="rounded-md overflow-hidden shadow-xl"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                whileHover={{ scale: 1.03, transition: { duration: 0.3 } }}
              >
                <img
                  src="/photo-1747582411588-f9b4acabe995 (1).jpg"
                  alt="Modern House"
                  className="w-full h-full object-cover"
                />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-[#202e44]/50 to-transparent flex items-end justify-center p-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.9 }}
                >
                  <motion.button
                    className="bg-white text-[#202e44] px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Check Flow <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </motion.div>
              </motion.div>
              <motion.div
                className="absolute inset-0 border-4 border-[#A9BBC8] rounded-md -m-3 z-[-1]"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              ></motion.div>

              {/* Floating accent elements */}
              <motion.div
                className="absolute -top-4 -right-8 w-16 h-16 rounded-full bg-[#88734C]/10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.9 }}
                style={isMounted ? { y: y1 } : {}}
              ></motion.div>
              <motion.div
                className="absolute -bottom-6 -left-10 w-20 h-20 rounded-full bg-[#A9BBC8]/15"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1.1 }}
                style={isMounted ? { y: y2 } : {}}
              ></motion.div>

              {/* Additional decorative elements */}
              <motion.div
                className="absolute -top-10 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#88734C]"
                animate={{
                  y: [0, -10, 0],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              ></motion.div>
              <motion.div
                className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#A9BBC8]"
                animate={{
                  y: [0, 10, 0],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
              ></motion.div>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-16">
            {services
              .filter((service) => service.position === "right")
              .map((service, index) => (
                <ServiceItem
                  key={`right-${index}`}
                  icon={service.icon}
                  secondaryIcon={service.secondaryIcon}
                  title={service.title}
                  description={service.description}
                  delay={index * 0.2}
                  direction="right"
                />
              ))}
          </div>
        </div>

        {/* Stats Section */}
        <motion.div
          ref={statsRef}
          className="mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          initial="hidden"
          animate={isStatsInView ? "visible" : "hidden"}
          variants={containerVariants}
        >
          {stats.map((stat, index) => (
            <StatCounter
              key={index}
              icon={stat.icon}
              value={stat.value}
              label={stat.label}
              suffix={stat.suffix}
              delay={index * 0.1}
            />
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="mt-20 bg-[rgb(240,253,244)] p-8 rounded-xl flex flex-col md:flex-row items-center justify-between gap-6"
          initial={{ opacity: 0, y: 30 }}
          animate={isStatsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="flex-1">
            <h3 className="text-2xl font-medium mb-2" style={{ color: "hsl(144.9 80.4% 10%)" }}>Zie de volledige flow in actie</h3>
            <p style={{ color: "hsl(144.9 80.4% 10%)", opacity: 0.8 }}>Bekijk hoe het systeem van begin tot eind werkt in onze demo video.</p>
          </div>
          <motion.button
            className="bg-[rgb(187,247,208)] hover:bg-[rgb(187,247,208)]/90 px-6 py-3 rounded-lg flex items-center gap-2 font-medium transition-colors"
            style={{ color: "hsl(144.9 80.4% 10%)" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Bekijk Flow <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  )
}

interface ServiceItemProps {
  icon: React.ReactNode
  secondaryIcon?: React.ReactNode
  title: string
  description: string
  delay: number
  direction: "left" | "right"
}

function ServiceItem({ icon, secondaryIcon, title, description, delay, direction }: ServiceItemProps) {
  return (
    <motion.div
      className="flex flex-col group"
      transition={{ delay }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <motion.div
        className="flex items-center gap-3 mb-3"
        initial={{ x: direction === "left" ? -20 : 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: delay + 0.2 }}
      >
        <motion.div
          className="text-[#88734C] bg-[#88734C]/10 p-3 rounded-lg transition-colors duration-300 group-hover:bg-[#88734C]/20 relative"
          whileHover={{ rotate: [0, -10, 10, -5, 0], transition: { duration: 0.5 } }}
        >
          {icon}
          {secondaryIcon}
        </motion.div>
        <h3 className="text-xl font-medium group-hover:text-[#88734C] transition-colors duration-300" style={{ color: "hsl(144.9 80.4% 10%)", opacity: 0.8 }}>
          {title}
        </h3>
      </motion.div>
      <motion.p
        className="text-sm leading-relaxed pl-12"
        style={{ color: "hsl(144.9 80.4% 10%)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ duration: 0.6, delay: delay + 0.4 }}
      >
        {description}
      </motion.p>
      <motion.div
        className="mt-3 pl-12 flex items-center text-[#88734C] text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0 }}
      >
        <span className="flex items-center gap-1">
          Learn more <ArrowRight className="w-3 h-3" />
        </span>
      </motion.div>
    </motion.div>
  )
}

interface StatCounterProps {
  icon: React.ReactNode
  value: number | string
  label: string
  suffix: string
  delay: number
}

function StatCounter({ icon, value, label, suffix, delay }: StatCounterProps) {
  const countRef = useRef(null)
  const isInView = useInView(countRef, { once: false })
  const [hasAnimated, setHasAnimated] = useState(false)

  const springValue = useSpring(0, {
    stiffness: 50,
    damping: 10,
  })

  useEffect(() => {
    if (isInView && !hasAnimated) {
      springValue.set(typeof value === 'number' ? value : 0)
      setHasAnimated(true) // eslint-disable-line react-hooks/set-state-in-effect
    } else if (!isInView && hasAnimated) {
      springValue.set(0)
      setHasAnimated(false) // eslint-disable-line react-hooks/set-state-in-effect
    }
  }, [isInView, value, springValue, hasAnimated])

  const displayValue = useTransform(springValue, (latest) => Math.floor(latest))

  return (
    <motion.div
      className="bg-white/50 backdrop-blur-sm p-6 rounded-xl flex flex-col items-center text-center group hover:bg-white transition-colors duration-300"
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, delay },
        },
      }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <motion.div
        className="w-14 h-14 rounded-full bg-[#202e44]/5 flex items-center justify-center mb-4 text-[#88734C] group-hover:bg-[#88734C]/10 transition-colors duration-300"
        whileHover={{ rotate: 360, transition: { duration: 0.8 } }}
      >
        {icon}
      </motion.div>
      <motion.div ref={countRef} className="text-3xl font-bold flex items-center" style={{ color: "hsl(144.9 80.4% 10%)" }}>
        <motion.span>{typeof value === 'string' ? value : displayValue}</motion.span>
        <span>{suffix}</span>
      </motion.div>
      <p className="text-sm mt-1" style={{ color: "hsl(144.9 80.4% 10%)", opacity: 0.8 }}>{label}</p>
      <motion.div className="w-10 h-0.5 bg-[rgb(20,83,45)] mt-3 group-hover:w-16 transition-all duration-300" />
    </motion.div>
  )
}
