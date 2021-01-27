import { Match } from '../models'
import { resolutions } from './charts'

export function subscribe(io, socket) {
  socket.on('subscribe', async ({ room, params }) => {
    if (room == 'deals') {
      socket.join(`deals:${params.chain}.${params.market}`)

      const deals = await Match.find({ chain: params.chain, market: params.market })
        .select('time bid ask unit_price type')
        .sort({ time: -1 })
        .limit(200)

      socket.emit('new_deals', deals)
    }

    if (room == 'ticker') {
      socket.join(`ticker:${params.chain}.${params.market}.${params.resolution}`)
    }

    if (room == 'orders') {
      socket.join(`orders:${params.chain}.${params.market}`)
    }
  })
}

export function unsubscribe(io, socket) {
  socket.on('unsubscribe', ({ room, params }) => {
    if (room == 'deals') {
      socket.leave(`deals:${params.chain}.${params.market}`)
    }

    if (room == 'ticker') {
      Object.keys(resolutions).map(resolution => {
        socket.leave(`ticker:${params.chain}.${params.market}.${resolution}`)
      })
    }

    if (room == 'orders') {
      socket.leave(`orders:${params.chain}.${params.market}`)
    }
  })
}