function index() {
  return (
    <>
      <section className='gap-2 dark:bg-black bg-white border rounded-lg p-5'>
        <figure className=' relative w-full h-full bg-black'>
          <svg
            viewBox='0 0 285 80'
            preserveAspectRatio='xMidYMid slice'
            className='w-full absolute top-0 left-0 h-full '
          >
            <defs>
              <mask id='mask' x='0' y='0' width={'100%'} height={'100%'}>
                <rect
                  x='0'
                  y='0'
                  width={'100%'}
                  height={'100'}
                  style={{ fill: 'white', mask: 'url(#mask)' }}
                />
                <text
                  x='50%'
                  y='20%'
                  fill='red'
                  textAnchor='middle'
                  className=' italic underline font-bold'
                  fontSize='4'
                >
                  <tspan x='50%' dy='0'>Hola! ik ben Pim van Lieshout.</tspan>
                  <tspan x='50%' dy='5'>Voorstellen blijft altijd een uitdaging, maar ik waag toch een poging.</tspan>
                  <tspan x='50%' dy='5'>In mijn werk ben ik altijd gefascineerd geweest door procesoptimalisatie.</tspan>
                  <tspan x='50%' dy='5'>Buiten het werk om ben ik het liefst creatief bezig in de breedste zin</tspan>
                  <tspan x='50%' dy='5'>van het woord — van niets iets maken!</tspan>
                  <tspan x='50%' dy='5'>Sinds een jaar ben ik volledig gegrepen door het AI-virus.</tspan>
                  <tspan x='50%' dy='5'>Voor mij is dit de perfecte combinatie waarin mijn passie voor</tspan>
                  <tspan x='50%' dy='5'>procesverbetering en mijn creativiteit eindelijk volledig samenkomen.</tspan>
                  <tspan x='50%' dy='5'>Daarom ben ik oprichter van Pimplify.</tspan>
                  <tspan x='50%' dy='5'>Met Pimplify wil ik bedrijven helpen op een persoonlijke en pragmatische manier.</tspan>
                  <tspan x='50%' dy='5'>Omdat ik recent ben gestart, kan ik met trots zeggen dat ik innovatief en</tspan>
                  <tspan x='50%' dy='5'>flexibel genoeg ben om de modernste technieken op het gebied van AI en agents</tspan>
                  <tspan x='50%' dy='5'>te implementeren — tegen een fractie van de prijs die traditionele consultants vragen.</tspan>
                  <tspan x='50%' dy='5'>Functioneel ontwerp dat jij en ik allebei begrijpen.</tspan>
                  <tspan x='50%' dy='5'>Een persoonlijke aanpak, vanuit jouw wens!</tspan>
                </text>
              </mask>
            </defs>
            <rect
              x='0'
              y='0'
              width={'100%'}
              height={'100'}
              style={{ fill: '#000105', mask: 'url(#mask)' }}
            />
          </svg>
          <video autoPlay muted loop className='w-[80%] h-full '>
            <source
              src='https://videos.pexels.com/video-files/7710243/7710243-uhd_2560_1440_30fps.mp4'
              type='video/mp4'
            />
          </video>
        </figure>
      </section>
    </>
  );
}

export default index;
