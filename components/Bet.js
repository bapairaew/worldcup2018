import React from 'react'
import styled, { css } from 'styled-components'
import Text from 'components/Text'
import { font, color, space, shadow, breakpoint, emptyImage } from 'styles'
import moment from 'moment'
import CheckedIcon from 'react-icons/lib/go/check'
import { toast } from 'react-toastify'
import ReactLoading from 'react-loading'

const formatter = new Intl.NumberFormat()

const Container = styled.div`
  display: grid;
  grid-template-columns: 55px 55px 55px 55px 55px 55px;
  grid-column-gap: 3px;
  grid-template-rows: 40px 250px 20px 40px;
  grid-row-gap: 3px;
  align-items: center;
  justify-content: center;
  margin: ${space.large} ${space.large} ${space.large} 0;
  @media (max-width: ${breakpoint}px) {
    margin: ${space.large} 0 ${space.large} 0;
  }
  position: relative;
  &::after {
    content: '';
    position: absolute;
    left: 50%;
    top: 50%;
    width: 60px;
    height: 60px;
    margin-left: -32px;
    margin-top: -50px;
    border: 2px solid ${color.primary};
    border-radius: 50%;
  }
`

const Flag = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 0 0 6px ${props => props.won ? color.secondary : color.primary};
  margin: ${space.medium};
`

const Time = styled.div`
  grid-column-end: span 6;
  height: 100%;
  background: ${props => props.finished ? shadow.light : props.started ? color.green : shadow.medium};
  color: ${props => props.finished ? color.primary : '#fff'};
  display: flex;
  align-items: center;
  justify-content: center;
`

const TeamContainer = styled.div`
  grid-column-end: span 3;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 100%;
  background: ${shadow.light};
  > * {
    opacity: ${props => props.lost ? 0.1 : 1};
  }
`

const Odd = styled.div`
  grid-column-end: span 2;
  background: ${shadow.light};
  font-size: ${font.small}em;
  display: flex;
  align-items: center;
  justify-content: center;
  > * {
    opacity: 0.2;
  }
`

const BetContainer = styled.div`
  grid-column-end: span 2;
  width: 100%;
  height: 100%;
  position: relative;
`

const commonBetElementStyle = css`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  transform-style: flat;
  transition: transform 300ms ease-out;
`

const BetButton = styled.button`
  ${commonBetElementStyle}
  display: flex;
  justify-content: center;
  align-content: center;
  color: #fff;
  border: none;
  outline: none;
  cursor: pointer;
  background: ${shadow.medium};
  box-shadow: 0 0 10px ${shadow.medium};
  font-size: ${font.medium}em;
  pointer-events: ${props => props.started ? 'none' : 'auto'};
  ${commonBetElementStyle}
  transform: ${props => props.active ? 'rotateX(-90deg) translateZ(25px)' : 'rotateX(0deg) translateZ(25px)'};
`

const BetForm = styled.form`
  ${commonBetElementStyle}
  transform: ${props => props.active ? 'rotateX(0deg) translateZ(25px)' : 'rotateX(90deg) translateZ(25px)'};
  display: grid;
  grid-template-columns: 80px 33px;
`

const BetSubmit = styled.button`
  border: none;
  outline: none;
  cursor: pointer;
  color: #fff;
  background: ${props => props.started ? shadow.light : shadow.medium};
`

const BetInput = styled.input`
  background: transparent;
  border: 2px solid ${shadow.medium};
  border-right: 0;
  color: ${shadow.dark};
  text-align: center;
  font-weight: bold;
  font-size: ${font.medium}em;
  padding: 0 ${space.small};
  box-sizing: border-box;
  &:focus {
    outline: 3px solid ${shadow.dark};
  }
`

const BetContent = styled.div`
  width: 100%;
  height: 100%;
  background: ${props =>
    props.correct
      ? color.secondary
        : props.started
          ? shadow.light
          : shadow.medium};
  color: ${props => props.finished ? color.primary : '#fff'};
  display: grid;
  justify-content: center;
  align-content: center;
  box-sizing: border-box;
  font-weight: bold;
`

const AddButtonWrapper = styled.div`
  position: relative;
  height: 40px;
`

class Better extends React.PureComponent {
  state = {
    clicked: false,
    submitting: false,
    value: ''
  }

  handleSubmit = async (e) => {
    try {
      const { onBet = x => x, ...props } = this.props
      e.preventDefault()
      this.setState({ submitting: true })
      const response = await onBet({ ...props, value: this.state.value })
      this.setState({ submitted: true, value: '', clicked: false })
    } catch (ex) {
      toast.error(ex.message)
    } finally {
      this.setState({ submitting: false })
    }
  }

  render () {
    const { started, finished, won, team = {}, bets = [] } = this.props
    const { clicked, value, submitting, submitted } = this.state
    const active = value !== '' || clicked
    const bet = bets[0] || {}
    const correct = finished && bet.team === team.id && won
    const amount = bets.reduce((a, b) => a + b.amount, 0)
    return (
      <BetContainer role='button' started={started}>
        {submitting ? (
          <BetContent>
            <ReactLoading type='bubbles' height={30} width={30} />
          </BetContent>
        ) : started ? (
          <BetContent started={started} finished={finished} correct={correct}>
            {amount ? formatter.format(amount) : ' '}
          </BetContent>
        ) : bet.id ? (
          <React.Fragment>
            <BetContent started>
              {amount ? formatter.format(amount) : ' '}
            </BetContent>
            <AddButtonWrapper>
              <BetButton
                active={active}
                onClick={() => this.setState({ clicked: true }, () => this.input.focus())}>
                Add
              </BetButton>
              <BetForm active={active} onSubmit={this.handleSubmit}>
                <BetInput
                  innerRef={e => { this.input = e }}
                  type='text'
                  disabled={submitting}
                  onBlur={() => this.setState({ clicked: false })}
                  onChange={e => this.setState({ value: e.target.value })}
                  value={value ? value : ''} />
                <BetSubmit disabled={submitting}><CheckedIcon size={20} /></BetSubmit>
              </BetForm>
            </AddButtonWrapper>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <BetButton
              active={active}
              onClick={() => this.setState({ clicked: true }, () => this.input.focus())}>
              Bet
            </BetButton>
            <BetForm active={active} onSubmit={this.handleSubmit}>
              <BetInput
                innerRef={e => { this.input = e }}
                type='text'
                disabled={submitting}
                onBlur={() => this.setState({ clicked: false })}
                onChange={e => this.setState({ value: e.target.value })}
                value={value ? value : ''} />
              <BetSubmit disabled={submitting}><CheckedIcon size={20} /></BetSubmit>
            </BetForm>
          </React.Fragment>
        )}
      </BetContainer>
    )
  }
}

const Team = ({ team = {}, result, finished, won }) => (
  <TeamContainer lost={finished && !won}>
    <Flag src={team.flag || emptyImage} alt={team.name} won={finished && won} />
    <Text dusha={result === null} tag='h2' size={2}>{result !== null ? result : team.fifaCode}</Text>
  </TeamContainer>
)

class Bet extends React.PureComponent {
  state = { betting: false }

  handleBet = async (props) => {
    try {
      const response = await this.props.onBet(props)
      return response
    } catch (ex) {
      throw ex
    }
  }

  render () {
    const { bets = [], odd = {}, date: _date = '2016-01-01', finished = true, name, home_team, away_team, home_result, away_result, onBet } = this.props
    const date = moment(_date)
    const now = moment()
    const started = date.isBefore(now)

    return (
      <Container>
        <Time started={started} finished={finished}>{finished ? 'Finished' : started ? 'Live' : date.fromNow()}</Time>
        <Team finished={finished} team={home_team} result={home_result} won={home_result > away_result} />
        <Team finished={finished} team={away_team} result={away_result} won={away_result > home_result} />
        <Odd><span>{odd.home}x</span></Odd>
        <Odd><span>{odd.draw}x</span></Odd>
        <Odd><span>{odd.away}x</span></Odd>
        <Better bets={bets.filter(b => b.team === home_team.id)} started={started} finished={finished} team={home_team} onBet={this.handleBet} won={home_result > away_result} />
        <Better bets={bets.filter(b => b.team === -1)} started={started} finished={finished} team={{ id: -1 }} onBet={this.handleBet} won={home_result === away_result} />
        <Better bets={bets.filter(b => b.team === away_team.id)} started={started} finished={finished} team={away_team} onBet={this.handleBet} won={away_result > home_result} />
      </Container>
    )
  }
}

export default Bet
