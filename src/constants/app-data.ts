import type { Prediction } from '../utils/types'

export const APP_NAME = 'Prode Pro'

const MS_HOUR = 60 * 60 * 1000
const MS_DAY = 24 * MS_HOUR

export const MOCK_PREDICTIONS: Prediction[] = [
  {
    prediccionGolesLocal: 2,
    prediccionGolesVisitante: 1,
    grupo: {
      id: '1',
      nombre: 'Grupo amigos',
      icono: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTv3pdU5JXffFVf_PIsSusNpga_ZMi1Rgux8MO251d-rg&s=10',
    },
    partido: {
      id: 'p1',
      golesLocal: 2,
      golesVisitante: 1,
      fecha: 5,
      fechaPartido: Date.now() - 2 * MS_DAY,
      equipoLocal: {
        nombre: 'River Plate',
        escudo: 'https://paladarnegro.net/escudoteca/argentina/primeradivision/img/river.jpg',
      },
      equipoVisitante: {
        nombre: 'Boca Juniors',
        escudo: 'https://paladarnegro.net/escudoteca/argentina/primeradivision/img/boca2026.jpg',
      },
    },
  },
  {
    prediccionGolesLocal: 1,
    prediccionGolesVisitante: 2,
    grupo: {
      id: '2',
      nombre: 'Prode trabajo',
      icono: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRO6F4lRHj08jqcJ1i_CmpxGWIj9FhAD3fe3S2JQw0u6g&s=10',
    },
    partido: {
      id: 'p2',
      golesLocal: 0,
      golesVisitante: 3,
      fecha: 5,
      fechaPartido: Date.now() - 3 * MS_HOUR,
      equipoLocal: {
        nombre: 'Racing Club',
        escudo: 'https://paladarnegro.net/escudoteca/argentina/primeradivision/img/racing.jpg',
      },
      equipoVisitante: {
        nombre: 'Independiente',
        escudo: 'https://paladarnegro.net/escudoteca/argentina/primeradivision/img/independiente.jpg',
      },
    },
  },
  {
    prediccionGolesLocal: 2,
    prediccionGolesVisitante: 0,
    grupo: {
      id: '3',
      nombre: 'Torneo familia',
      icono: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ526KT7h9nkMoV1XI-lmuJMYfo0d4GiKNXVHjMt-CjaA&s=10',
    },
    partido: {
      id: 'p3',
      golesLocal: 1,
      golesVisitante: 1,
      fecha: 6,
      fechaPartido: Date.now() + 2 * MS_DAY,
      equipoLocal: {
        nombre: 'San Lorenzo',
        escudo: 'https://paladarnegro.net/escudoteca/argentina/primeradivision/img/sanlorenzo.jpg',
      },
      equipoVisitante: {
        nombre: 'Huracán',
        escudo: 'https://paladarnegro.net/escudoteca/argentina/primeradivision/img/huracan.jpg',
      },
    },
  },
]
