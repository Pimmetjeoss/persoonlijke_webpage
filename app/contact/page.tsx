'use client';
import { useEffect, useRef, useState } from 'react';
import { animate, scroll, spring } from 'motion';
import { ReactLenis } from 'lenis/react';
import { Plus } from 'lucide-react';
import { StickyFooter } from '@/app/components/sticky-footer';
import Image from 'next/image';
import Link from 'next/link';

function ContactHeader() {
  const [isHovered, setIsHovered] = useState(false);
  const [scrollPhase, setScrollPhase] = useState<'visible' | 'half' | 'hidden'>('visible');

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY > 450) {
        setScrollPhase('hidden');
      } else if (scrollY > 10) {
        setScrollPhase('half');
      } else {
        setScrollPhase('visible');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getTransform = () => {
    if (scrollPhase === 'hidden' && !isHovered) return 'translateY(-100%)';
    if (scrollPhase === 'half' && !isHovered) return 'translateY(-30%)';
    return 'translateY(0)';
  };

  return (
    <>
      <div
        className="sticky top-0"
        style={{
          zIndex: 100000,
          height: '3px',
          backgroundColor: 'black',
        }}
      />
      <div
        className="sticky top-0"
        style={{
          marginTop: '-3px',
          zIndex: 99999,
          overflow: 'hidden',
        }}
      >
        <header
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="border-t-[3px] border-b-[3px] border-black"
          style={{
            transform: getTransform(),
            backgroundColor: isHovered ? 'hsl(141, 78.9%, 85.1%)' : 'hsl(141, 78.9%, 85.1%)',
            color: 'hsl(144.9, 80.4%, 10%)',
            zIndex: isHovered ? 50 : 1,
            transition: 'all 300ms ease-out',
          }}
        >
          <div className="pt-4 pb-2 px-4 md:px-8 lg:px-16">
            <div className="grid grid-cols-[1fr_auto] gap-8 items-end w-full max-w-7xl mx-auto">
              <div>
                <h1
                  className="text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight leading-[0.85]"
                  style={{ color: 'hsl(144.9, 80.4%, 10%)' }}
                >
                  CONTACT
                </h1>
              </div>
              <div className="flex items-center justify-center pb-2">
                <div
                  className="w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110"
                  style={{ backgroundColor: 'hsl(142.1, 76.2%, 36.3%)' }}
                >
                  <Plus className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
              </div>
            </div>
          </div>
        </header>
      </div>
    </>
  );
}

export default function HorizontalScroll() {
  const ulRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const items = document.querySelectorAll('li');

    if (ulRef.current) {
      const controls = animate(
        ulRef.current,
        {
          transform: ['none', `translateX(-${items.length - 1}00vw)`],
        } as any,
        { easing: spring() } as any
      );
      const section = document.querySelector('section');
      if (section) {
        scroll(controls, { target: section });
      }
    }

    const segmentLength = 1 / items.length;
    items.forEach((item, i) => {
      const header = item.querySelector('h2');

      if (header) {
        const section = document.querySelector('section');
        if (section) {
          scroll(animate([header] as any, { x: [800, -800] } as any), {
            target: section,
            offset: [
              [i * segmentLength, 1],
              [(i + 1) * segmentLength, 0],
            ],
          });
        }
      }
    });

    // YouTube underline scroll animation
    const youtubeSection = document.querySelector('.youtube-section');
    const youtubeUnderline = document.querySelector('.youtube-underline') as HTMLElement;
    if (youtubeSection && youtubeUnderline) {
      const section = document.querySelector('section');
      if (section) {
        // Animate when YouTube section (index 3) comes into view
        scroll(
          (progress: number) => {
            // YouTube is item 3 (0-indexed), so it's visible around 60-80% of the scroll
            const youtubeStart = 3 / items.length;
            const youtubeEnd = 4 / items.length;

            if (progress >= youtubeStart && progress <= youtubeEnd) {
              const localProgress = (progress - youtubeStart) / (youtubeEnd - youtubeStart);
              youtubeUnderline.style.transform = `scaleX(${Math.min(localProgress * 2, 1)})`;
            } else if (progress < youtubeStart) {
              youtubeUnderline.style.transform = 'scaleX(0)';
            }
          },
          { target: section }
        );
      }
    }
  }, []);

  return (
    <ReactLenis root>
      <main className='bg-[hsl(141,78.9%,85.1%)]'>
        <ContactHeader />

        {/* Section Card onder de header */}
        <div className="mx-auto max-w-5xl p-6 lg:p-10">
          <div
            id="contact-info"
            className="w-full rounded-xl border-[3px] bg-white p-8 md:p-12 shadow-xl"
            style={{ borderColor: "hsl(144.9 80.4% 10%)" }}
          >
            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight"
              style={{ color: "hsl(144.9 80.4% 10%)" }}
            >
              Bedankt dat je contact met mij wil opnemen. Ik voel me vereerd! Scroll gauw naar beneden en hou pen en papier bij de hand.
              <br /><br />
              Met vriendelijke groet,
              <br /><br />
              Pim van Lieshout
            </h2>
          </div>
        </div>

        <article className='mt-[300px]'>
          <section className='h-[500vh] relative'>
            <ul ref={ulRef} className='flex sticky top-0 h-screen'>
              <li className='relative h-screen w-[100vw] min-w-[100vw] flex flex-col justify-center overflow-visible items-center' style={{ backgroundColor: 'hsl(142.1, 76.2%, 36.3%)' }}>
                <h1
                  className='text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight leading-tight inline-block'
                  style={{
                    backgroundImage: 'linear-gradient(to bottom, hsl(138.5, 76.5%, 96.7%) 50%, hsl(141, 78.9%, 85.1%) 50%)',
                    backgroundSize: '100% 100%',
                    backgroundRepeat: 'no-repeat',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    color: 'transparent',
                  }}
                >
                  pim@code-lieshout.nl
                </h1>
                <span
                  className='text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight'
                  style={{ color: 'hsl(141, 78.9%, 85.1%)' }}
                >
                  Mail adres
                </span>
                <Image
                  src="/cactus_mail.png"
                  alt="Cactus met email"
                  width={900}
                  height={900}
                  className="absolute left-1/2 -translate-x-1/2 -top-[200px] object-contain opacity-90 z-10"
                />
              </li>
              <li className='relative h-screen w-[100vw] min-w-[100vw] flex flex-col justify-center overflow-hidden items-center' style={{ backgroundColor: 'hsl(142.4, 71.8%, 29.2%)' }}>
                <span
                  className='text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-2'
                  style={{ color: 'hsl(141, 78.9%, 85.1%)' }}
                >
                  Mobiel nummer
                </span>
                <h1
                  className='text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight leading-[0.85] inline-block'
                  style={{
                    color: 'hsl(141, 78.9%, 85.1%)',
                    textShadow: '8px 8px 0px hsl(144.9, 80.4%, 10%)'
                  }}
                >
                  0612419980
                </h1>
                <Image
                  src="/cactus_mobile.png"
                  alt="Cactus met telefoon"
                  width={900}
                  height={900}
                  className="absolute bottom-0 right-0 object-contain opacity-90"
                />
              </li>
              <li className='relative h-screen w-[100vw] min-w-[100vw] flex flex-col justify-center overflow-hidden items-center' style={{ backgroundColor: 'hsl(142.8, 64.2%, 24.1%)' }}>
                <span
                  className='text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-2'
                  style={{ color: 'hsl(141, 78.9%, 85.1%)' }}
                >
                  Social 1
                </span>
                <h1
                  className='text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight leading-[0.85] inline-block transition-colors duration-300 hover:text-[hsl(141,78.9%,85.1%)] cursor-pointer'
                  style={{
                    color: 'transparent',
                    WebkitTextStroke: '3px hsl(141, 78.9%, 85.1%)'
                  }}
                >
                  Instagram
                </h1>
                <Image
                  src="/cactus_instagram.png"
                  alt="Cactus met Instagram"
                  width={600}
                  height={600}
                  className="absolute left-1/2 -translate-x-1/2 bottom-[-150px] object-contain opacity-90"
                />
              </li>
              <li className='relative h-screen w-[100vw] min-w-[100vw] flex flex-col justify-center overflow-hidden items-center youtube-section' style={{ backgroundColor: 'hsl(143.8, 61.2%, 20.2%)' }}>
                <span className='relative inline-block'>
                  <h1 className='text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight leading-[0.85] inline-block' style={{ color: 'hsl(141, 78.9%, 85.1%)' }}>
                    Youtube
                  </h1>
                  <span
                    className='youtube-underline absolute left-0 bottom-0 w-full h-3 md:h-4'
                    style={{
                      backgroundColor: 'hsl(141, 78.9%, 85.1%)',
                      transform: 'scaleX(0)',
                      transformOrigin: 'left',
                      transition: 'transform 0.6s ease-out'
                    }}
                  />
                </span>
                <span
                  className='text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mt-2'
                  style={{ color: 'hsl(141, 78.9%, 85.1%)' }}
                >
                  Alle filmpjes.
                </span>
                <Image
                  src="/cactus_youtube.png"
                  alt="Cactus met YouTube"
                  width={900}
                  height={900}
                  className="absolute top-0 left-0 object-contain opacity-90"
                />
              </li>
              <li className='relative h-screen w-[100vw] min-w-[100vw] flex flex-col justify-center overflow-hidden items-center' style={{ backgroundColor: 'hsl(144.9, 80.4%, 10%)' }}>
                <span
                  className='text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-2'
                  style={{ color: 'hsl(141, 78.9%, 85.1%)' }}
                >
                  Social 2
                </span>
                <h1
                  className='text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight leading-[0.85] inline-block border-4 rounded-2xl px-8 py-4'
                  style={{
                    color: 'hsl(141, 78.9%, 85.1%)',
                    borderColor: 'hsl(141, 78.9%, 85.1%)'
                  }}
                >
                  LinkedIn
                </h1>
                <Image
                  src="/cactus_linkedin.png"
                  alt="Cactus met LinkedIn"
                  width={900}
                  height={900}
                  className="absolute bottom-0 right-0 object-contain opacity-90"
                />
              </li>
            </ul>
          </section>
          <footer className='h-[80vh] flex items-center justify-center' style={{ backgroundColor: 'hsl(141, 78.9%, 85.1%)' }}>
            <div className="mx-auto max-w-5xl p-6 lg:p-10">
              <Link href="/portfolio">
                <div
                  className="w-full rounded-xl border-[3px] bg-white p-8 md:p-12 shadow-xl cursor-pointer hover:scale-105 transition-transform duration-300"
                  style={{ borderColor: "hsl(144.9 80.4% 10%)" }}
                >
                  <h2
                    className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight"
                    style={{ color: "hsl(144.9 80.4% 10%)" }}
                  >
                    HOUDOE EN BEDANKT!
                  </h2>
                </div>
              </Link>
            </div>
          </footer>
        </article>
      </main>
      <StickyFooter />
    </ReactLenis>
  );
}
