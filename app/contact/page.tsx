'use client';
import { useEffect, useRef, useState } from 'react';
import { animate, scroll, spring } from 'motion';
import { ReactLenis } from 'lenis/react';
import { Plus } from 'lucide-react';
import { StickyFooter } from '@/app/components/sticky-footer';
import Image from 'next/image';

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
                <h1 className="text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight leading-[0.85]">
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
              <li className='h-screen w-[100vw] min-w-[100vw] flex flex-col justify-center overflow-hidden items-center' style={{ backgroundColor: 'hsl(142.1, 76.2%, 36.3%)' }}>
                <h1 className='text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight leading-[0.85] relative bottom-5 inline-block' style={{ color: 'hsl(141, 78.9%, 85.1%)' }}>
                  pim@code-lieshout.nl
                </h1>
              </li>
              <li className='h-screen w-[100vw] min-w-[100vw] flex flex-row justify-center overflow-hidden items-center gap-8' style={{ backgroundColor: 'hsl(142.4, 71.8%, 29.2%)' }}>
                <h1 className='text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight leading-[0.85] inline-block' style={{ color: 'hsl(141, 78.9%, 85.1%)' }}>
                  0612419980
                </h1>
                <Image
                  src="/cactus_mobile.png"
                  alt="Cactus met telefoon"
                  width={300}
                  height={300}
                  className="object-contain"
                />
              </li>
              <li className='h-screen w-[100vw] min-w-[100vw] flex flex-col justify-center overflow-hidden items-center' style={{ backgroundColor: 'hsl(142.8, 64.2%, 24.1%)' }}>
                <h1 className='text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight leading-[0.85] relative bottom-5 inline-block' style={{ color: 'hsl(141, 78.9%, 85.1%)' }}>
                  Instagram
                </h1>
              </li>
              <li className='h-screen w-[100vw] min-w-[100vw] flex flex-row justify-center overflow-hidden items-center gap-8' style={{ backgroundColor: 'hsl(143.8, 61.2%, 20.2%)' }}>
                <h1 className='text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight leading-[0.85] inline-block' style={{ color: 'hsl(141, 78.9%, 85.1%)' }}>
                  Youtube
                </h1>
                <Image
                  src="/cactus_youtube.png"
                  alt="Cactus met YouTube"
                  width={300}
                  height={300}
                  className="object-contain"
                />
              </li>
              <li className='h-screen w-[100vw] min-w-[100vw] flex flex-row justify-center overflow-hidden items-center gap-8' style={{ backgroundColor: 'hsl(144.9, 80.4%, 10%)' }}>
                <h1 className='text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight leading-[0.85] inline-block' style={{ color: 'hsl(141, 78.9%, 85.1%)' }}>
                  LinkedIn
                </h1>
                <Image
                  src="/cactus_linkedin.png"
                  alt="Cactus met LinkedIn"
                  width={300}
                  height={300}
                  className="object-contain"
                />
              </li>
            </ul>
          </section>
          <footer className='h-[80vh]' style={{ backgroundColor: 'hsl(144.9, 80.4%, 10%)' }}>
          </footer>
        </article>
      </main>
      <StickyFooter />
    </ReactLenis>
  );
}
