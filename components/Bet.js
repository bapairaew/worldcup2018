import React from 'react'
import styled, { css } from 'styled-components'
import Text from 'components/Text'
import { color, space, shadow, breakpoint, emptyImage } from 'styles'
import moment from 'moment'
import CheckedIcon from 'react-icons/lib/go/check'
import { toast } from 'react-toastify'
import ReactLoading from 'react-loading'

const formatter = new Intl.NumberFormat()

const Container = styled.div`
  display: grid;
  grid-template-columns: 175px 175px;
  grid-column-gap: 3px;
  grid-template-rows: 40px 250px 40px;
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
  box-shadow: 0 0 0 6px ${props => props.won ? color.green : color.primary};
  margin: ${space.medium};
`

const Time = styled.div`
  grid-column-end: span 2;
  height: 100%;
  background: ${props => props.finished ? shadow.light : props.started ? color.green : shadow.medium};
  color: ${props => props.finished ? color.primary : '#fff'};
  display: flex;
  align-items: center;
  justify-content: center;
`

const TeamContainer = styled.div`
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

const BetContainer = styled.div`
  width: 175px;
  height: 40px;
  position: relative;
`

const betElementSize = css`
`

const commonBetElementStyle = css`
  position: absolute;
  left: 0;
  top: 0;
  width: 175px;
  height: 40px;
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
  pointer-events: ${props => props.started ? 'none' : 'auto'};
  ${commonBetElementStyle}
  transform: ${props => props.active ? 'rotateX(-90deg) translateZ(25px)' : 'rotateX(0deg) translateZ(25px)'};
`

const BetForm = styled.form`
  ${commonBetElementStyle}
  transform: ${props => props.active ? 'rotateX(0deg) translateZ(25px)' : 'rotateX(90deg) translateZ(25px)'};
  display: grid;
  grid-template-columns: 135px 40px;
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
  font-size: 1.1em;
  padding: 0 ${space.small};
  box-sizing: border-box;
  &:focus {
    outline: 3px solid ${shadow.dark};
  }
`

const BetContent = styled.div`
  width: 100%;
  height: 100%;
  background: ${props => props.correct ? color.secondary : (props.bet && !props.finished) ? shadow.medium : shadow.light};
  color: ${props => props.finished ? color.primary : '#fff'};
  display: grid;
  justify-content: center;
  align-content: center;
  box-sizing: border-box;
  font-weight: bold;
`

class Better extends React.PureComponent {
  state = {
    clicked: false,
    submitting: false,
    submitted: false,
    value: ''
  }

  handleSubmit = async (e) => {
    try {
      const { onBet = x => x, ...props } = this.props
      e.preventDefault()
      this.setState({ submitting: true })
      const response = await onBet({ ...props, value: this.state.value })
      this.setState({ submitted: true })
    } catch (ex) {
      toast.error(ex.message)
    } finally {
      this.setState({ submitting: false })
    }
  }

  render () {
    const { betting, started, finished, won, team = {}, bet = {} } = this.props
    const { clicked, value, submitting, submitted } = this.state
    const active = value !== '' || clicked
    const correct = finished && bet.team === team.id && won
    return (
      <BetContainer role='button' started={started}>
        {betting ? (
          <BetContent>
            <ReactLoading type='bubbles' height={30} width={30} />
          </BetContent>
        ) : (bet.id || started || submitting || submitted) ? (
          <BetContent bet={bet.team === team.id} finished={finished} correct={correct}>
            {bet.team === team.id && bet.amount && formatter.format(bet.amount)}
          </BetContent>
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
      this.setState({ betting: true })
      const response = await this.props.onBet(props)
      return response
    } catch (ex) {
      throw ex
    } finally {
      this.setState({ betting: false })
    }
  }

  render () {
    const { bet = {}, date: _date = '2016-01-01', finished = true, name, home_team, away_team, home_result, away_result, onBet } = this.props
    const { betting } = this.state
    const date = moment(_date)
    const now = moment()
    const started = date.isBefore(now)

    return (
      <Container>
        <Time started={started} finished={finished}>{finished ? 'Finished' : started ? 'Live' : date.fromNow()}</Time>
        <Team finished={finished} team={home_team} result={home_result} won={home_result > away_result} />
        <Team finished={finished} team={away_team} result={away_result} won={away_result > home_result} />
        <Better betting={betting} bet={bet} started={started} finished={finished} team={home_team} onBet={this.handleBet} won={home_result > away_result} />
        <Better betting={betting} bet={bet} started={started} finished={finished} team={away_team} onBet={this.handleBet} won={away_result > home_result} />
      </Container>
    )
  }
}

export default Bet
