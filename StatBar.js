import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classnames from 'classnames';
import numeral from 'numeral';
import './statbar.scss';
import {spz} from '/vendor';
import config from '/config/config';
const { main, mainIds } = config.colors;

/**
 * StatBar component
 *
 * Author Kevin Reynolds <kevin.reynolds@nimbletank.com>
 *
 * The StatBar component renders a percentage in bar chart form, with optional benchmark indicator and increase overlay
 *
 * @param {string} size (default: small) - [small,large] if large, renders a fatter bar
 * @param {string} label - The label for the bar chart
 * @param {number} stat - [0-100] The percentage to display
 * @param {number} stat2 - [0-100] Optional second percentage, will be appended to the end of the first.
        Should not be used in conjunction with 'increase'
 * DEPRECATED @param {style} - [pink,green,blue] The color of the bar
 * @param {string} color - ['pink','green','blue','orange','yellow','red','purple', {hex value}] The colour of the bar
 * @param {number} benchmark - [0-100] displays a marker at entered percentage
 * @param {number} increase - [0-100] displays an overlay showing second percentage. Should not be used in conjuntion with 'stat2'
 * @param {number} labelStat - displays as an actual value of the stat percentage render
 *
 * @return {StatBar} A StatBar component
 */

class StatBar extends Component {

    constructor(props) {
        super(props);

        this.barValue = null;
        this.barValue2 = null;
        this.barBenchmark = null;
        this.barIncrease = null;
        this.barLabel = null;
        this.barIncreaseLabel = null;
        this.animateBarTimeout = null;
        this.animateBar2Timeout = null;
    }

    componentDidMount() {
        this.animateBarExpand();
    }

    componentDidUpdate() {
        this.animateBarExpand();
    }

    componentWillUnmount() {
        clearTimeout(this.animateBarTimeout);
        clearTimeout(this.animateBar2Timeout);
    }

    animateBarExpand() {
        let barScale = 0,
            barScale2 = 0;
        let ease = '0.4, 0.9, 0.6, 1.0'; //ease-in-out

        const easeIn = '0.42,0,1,1',
            easeOut = '0.25,0.1,0.25,1';

        if(this.barValue2) {
            spz.resetTransition(this.barValue2);
            barScale2 = this.barValue2.getAttribute('data-stat');
            spz.trans2d(this.barValue2, 0, 0, 0, 0, 1);
            spz.transit(this.barValue2, 'transform', 0, easeOut);
            spz.setTransformOrigin(this.barValue2, 0,0);

            ease = easeIn; //if second bar exists, dont ease out first bar to keep anim smooth
        }

        if(this.barValue) {
            spz.resetTransition(this.barValue);
            barScale = this.barValue.getAttribute('data-stat');

            spz.trans2d(this.barValue, 0, 0, 0, 0, 1);
            spz.transit(this.barValue, 'transform', 0, ease);
            spz.setTransformOrigin(this.barValue, 0,0);
        }

        if(this.barBenchmark) {
            spz.resetTransition(this.barBenchmark);
            spz.css(this.barBenchmark, { opacity: 0 });
        }
        if(this.barIncrease) {
            spz.trans2d(this.barIncrease, 0, 0, 0, 0, 1);
            spz.transit(this.barIncrease, 'transform', 0, ease);
            spz.setTransformOrigin(this.barIncrease, 0,0);
        }
        if(this.barLabel) {
            spz.resetTransition(this.barLabel);
            spz.css(this.barLabel, { opacity: 0 });
        }
        if(this.barIncreaseLabel) {
            spz.resetTransition(this.barIncreaseLabel);
            spz.css(this.barIncreaseLabel, { opacity: 0 });
        }
        this.animateBarTimeout = setTimeout(() => {
            if(this.barValue) {
                spz.trans2d(this.barValue, 0, 0, 0, 1, 1);
                spz.transit(this.barValue, 'transform', 15*barScale, ease);
            }
            if(this.barBenchmark) {
                spz.css(this.barBenchmark, { opacity: 1 });
                spz.transit(this.barBenchmark, 'opacity', 1000, ease);
            }
            if(this.barIncrease) {
                spz.trans2d(this.barIncrease, 0, 0, 0, 1, 1);
                spz.transit(this.barIncrease, 'transform', 15*barScale, ease);
            }
            if(this.barLabel) {
                spz.css(this.barLabel, { opacity: 1 });
                spz.transit(this.barLabel, 'opacity', 500, ease, 15*barScale);
            }
            if(this.barIncreaseLabel) {
                spz.css(this.barIncreaseLabel, { opacity: 1 });
                spz.transit(this.barIncreaseLabel, 'opacity', 500, ease, 15*barScale);
            }
        }, 500);

        if(this.barValue2) {
            this.animateBar2Timeout = setTimeout(() => {
                spz.trans2d(this.barValue2, 0, 0, 0, 1, 1);
                spz.transit(this.barValue2, 'transform', 15*barScale2, easeOut);
            }, (500+(15*barScale)));
        }
    }

    showBenchmark() {
        if(this.props.benchmark) {
            return (
                <div
                    ref={(ref) => this.barBenchmark = ref}
                    className={classnames(
                        'statbar__benchmark',
                        {'statbar__benchmark--pink' : this.props.style === 'white' && (this.props.stat > this.props.benchmark)}
                    )}
                    style={{left: `${this.props.benchmark}%`}} />
            );
        }
    }

    showIncrease() {
        const {increase, stat} = this.props,
            color = this.setColor();

        // const increasedValue = stat * (1 + (increase / 100));
        const increasedValue = stat + increase;

        //data integrity check
        if(increasedValue > 100) {
            console.warn('DATA INTEGRITY: Stat with increase applied should not exceed 100%');
        }

        if(increase) {
            return (
                <div>
                    <div
                        ref={(ref) => this.barLabel = ref}
                        className={classnames(
                            'statbar__bar-label',
                            {'statbar__bar-label--white' : this.props.color === 'white' && stat > 10},
                            {'statbar__bar-label--outside' : stat < 10}
                        )}
                        style={{width: `${(stat > 10) ? stat : stat+13}%`}}>
                        {stat}%
                    </div>
                    <div
                        ref={(ref) => this.barIncrease = ref}
                        className="statbar__increase"
                        style={{width: `${increasedValue}%`, backgroundColor: color}} />
                    <div
                        ref={(ref) => this.barIncreaseLabel = ref}
                        className="statbar__increase-label">
                        {`+${increase}%`}
                    </div>
                </div>
            );
        }
    }


    setColor() {
        const {style} = this.props;
        let {color} = this.props;

        if(style) {
            color = style;
        }

        if(color.substring(0, 1) !== '#') {
            const colorIndex = mainIds[color];
            color = main[colorIndex][0];
        }

        return color;
    }

    render() {
        const {size, label, stat, stat2, labelStat, increasePeople} = this.props;

        const color = this.setColor();

        //data integrity checks
        if(stat > 100) {
            console.warn('DATA INTEGRITY: Stat should not exceed 100%');
        }

        return (
            <div
                className={classnames(
                    'statbar',
                    {'statbar--large' : size === 'large'}
                )} >
                <div className="statbar__label">
                    {label}
                    {labelStat &&
                        <div className="statbar__label-stat">{numeral(labelStat).format(0)}%</div>
                    }
                    {increasePeople !== null && increasePeople !== 0 &&
                        <div className="statbar__label-people">+{numeral(increasePeople).format(0,0)} people</div>
                    }
                </div>
                <div 
                    className={classnames(
                        'statbar__bar',
                        {'statbar__bar--nolabel' : label === ''}
                    )}>
                    <div
                        ref={(ref) => this.barValue = ref}
                        className="statbar__bar-value"
                        data-stat={stat}
                        style={{width: `${stat}%`, backgroundColor: color}} />

                    {stat2 !== 0 &&
                        <div
                            ref={(ref) => this.barValue2 = ref}
                            className="statbar__bar-value-2"
                            data-stat={stat2}
                            style={{width: `${stat2}%`, left: `${stat}%`, backgroundColor: color}} />
                    }

                    {this.showBenchmark()}
                    {this.showIncrease()}
                </div>
            </div>
        );
    }
}

StatBar.propTypes = {
    size: PropTypes.string,
    label: PropTypes.string.isRequired,
    stat: PropTypes.number.isRequired,
    stat2: PropTypes.number,
    style: PropTypes.string,
    color: PropTypes.string,
    benchmark: PropTypes.number,
    increase: PropTypes.number,
    labelStat: PropTypes.number,
    increasePeople: PropTypes.number
};

StatBar.defaultProps = {
    color: 'pink',
    stat2: 0,
    labelStat: null,
    increasePeople: null
};

export default StatBar;
