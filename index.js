import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'

function getTimeRemaining(endtime) {
    var t = Date.parse(endtime) - Date.parse(new Date());
    var seconds = Math.floor((t / 1000) % 60);
    var minutes = Math.floor((t / 1000 / 60) % 60);
    var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
    var days = Math.floor(t / (1000 * 60 * 60 * 24));
    return {
      'days': days,
      'hours': hours,
      'minutes': minutes,
      'seconds': seconds
    };
}

const TIME_LIMIT = getTimeRemaining('2020-04-20')

const FULL_DASH_ARRAY = 314;

class ClocksDeckBuilder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            timeUnits: {},
            timeLimit: TIME_LIMIT,
        }
    }
    
    getTimeRemaining = () => {
        var t = Date.parse(this.props.endTime) - Date.parse(new Date());
        var seconds = Math.floor((t / 1000) % 60);
        var minutes = Math.floor((t / 1000 / 60) % 60);
        var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
        var days = Math.floor(t / (1000 * 60 * 60 * 24));
        this.setState( {
            timeUnits: {  
                days: days,
                hours: hours,
                minutes: minutes,
                seconds: seconds,
            }
        });
    }

    componentDidMount(){
        setInterval(this.getTimeRemaining, 1000)
    }

    render(){
        return(
            <div className="deck">
                <div className="row">
                    <div className="clock">
                        <Timer timeLimit={22} timeLeft={this.state.timeUnits.days} type={"Days"}/>
                    </div>
                    <div className="clock">
                        <Timer timeLimit={24} timeLeft={this.state.timeUnits.hours} type={"Hours"}/>
                    </div>
                </div>
                <div className="row">
                    <div className="clock">
                        <Timer timeLimit={60} timeLeft={this.state.timeUnits.minutes} type={"Minutes"}/>
                    </div>
                    <div className="clock">
                        <Timer timeLimit={60} timeLeft={this.state.timeUnits.seconds} type={"Seconds"}/>
                    </div>
                </div>
            </div>
            
        )
    }
}

class Timer extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            strokeDasharray: FULL_DASH_ARRAY,
            timeLeft: 0,
        }
    }

    calculateTimeFraction = () => {
        const rawTimeFraction = (this.props.timeLeft || this.state.timeLeft) / this.props.timeLimit;
        return rawTimeFraction - (1 / this.props.timeLimit) * (1 - rawTimeFraction);
    }
          
    setCircleDasharray = () => {
        const circleDasharray = `${(this.calculateTimeFraction() * FULL_DASH_ARRAY).toFixed(0)} 314`;
        document
          .getElementById(this.props.type)
          .setAttribute("stroke-dasharray", circleDasharray);
          this.setState({
              strokeDasharray: circleDasharray,
          })
    }

    restart = () => {
        if(this.props.timeLeft === 0){
            this.setState({timeLeft: this.props.timeLimit})
        }
    }

    componentDidMount() {
        this.setState({timeLeft: 20})
        
        setInterval(this.setCircleDasharray, 1000)
        setInterval(this.restart, 500);
        setInterval(() => this.setState({timeLeft:0}), 3000)
    }

    render() {

        return (
            <div className="base-timer">
                <svg className="base-timer__svg" viewBox="0 0 120 120">
                    <g className="base-timer__circle">
                    <circle className="base-timer__path-elapsed" cx="60" cy="60" r="50" />
                    <path
                        id={this.props.type}
                        strokeDasharray={this.state.strokeDasharray}
                        className="base-timer__path-remaining remainingPathColor"
                        d="
                        M 60, 60
                        m -50, 0
                        a 50,50 0 1,0 100,0
                        a 50,50 0 1,0 -100,0
                        "
                    ></path>
                    </g>
                </svg>
                <div className="base-timer__label">
                    <h2>{this.props.timeLeft}</h2>
                    <p>{this.props.type}</p>
                </div>
            </div>
        )
    }

}

ReactDOM.render(
    <ClocksDeckBuilder endTime={'2020-04-20'}/>,
    document.getElementById('root')
);