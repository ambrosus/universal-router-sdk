import { expect } from 'chai'
import { TransferCommand, V2SwapCommand } from '../src/router_types'
import { RouterPlanner } from '../src/planner'

const SAMPLE_ADDRESS_D = '0xdddddddddddddddddddddddddddddddddddddddd'
const SAMPLE_ADDRESS_E = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
const SAMPLE_ADDRESS_F = '0xffffffffffffffffffffffffffffffffffffffff'

describe('RouterPlanner', () => {
  it('properly encodes TransferCommand', () => {
    const planner = new RouterPlanner()
    planner.add(new TransferCommand(SAMPLE_ADDRESS_E, SAMPLE_ADDRESS_D, SAMPLE_ADDRESS_F, 55))
    planner.add(new TransferCommand(SAMPLE_ADDRESS_F, SAMPLE_ADDRESS_E, SAMPLE_ADDRESS_D, 55))

    const { commands, state } = planner.plan()
    expect(commands[0]).to.equal('0x0100010203ffffff')
    expect(commands[1]).to.equal('0x0102000103ffffff')
    expect(state[0]).to.equal('0x000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee')
    expect(state[1]).to.equal('0x000000000000000000000000dddddddddddddddddddddddddddddddddddddddd')
    expect(state[2]).to.equal('0x000000000000000000000000ffffffffffffffffffffffffffffffffffffffff')
    expect(state[3]).to.equal('0x0000000000000000000000000000000000000000000000000000000000000037')
  })

  it('properly encodes V2SwapCommand', () => {
    const planner = new RouterPlanner()
    planner.add(new V2SwapCommand(66, 1, [SAMPLE_ADDRESS_D, SAMPLE_ADDRESS_E], SAMPLE_ADDRESS_F))
    const { commands, state } = planner.plan()
    expect(commands[0]).to.equal('0x0300018203ffffff')
    expect(state[0]).to.equal('0x0000000000000000000000000000000000000000000000000000000000000042')
    expect(state[1]).to.equal('0x0000000000000000000000000000000000000000000000000000000000000001')
    expect(state[2]).to.equal(
      '0x0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000dddddddddddddddddddddddddddddddddddddddd000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
    )
    expect(state[3]).to.equal('0x000000000000000000000000ffffffffffffffffffffffffffffffffffffffff')
  })
})
