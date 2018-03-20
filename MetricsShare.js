import PropTypes from 'prop-types';
import React from 'react';
import numeral from 'numeral';

import StatBar from './StatBar';
import Metrics from './Metrics';
import { H2 } from '/components/common/Type/Text';
import './metrics.scss';

const MetricsShare = (props) => {

    return (

        <div className="metric-box">
            <Metrics title={props.title} bars={props.bars} onAddData={props.onAddData} />

            <div className="metric-box--share">
                <H2>{props.summary.label} <span>{numeral(props.summary.stat).format(0)}%</span></H2>

                <StatBar {...props.summary} />
            </div>
        </div>

    );

};

MetricsShare.propTypes = {
    title: PropTypes.string.isRequired,
    bars: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string.isRequired,
        stat: PropTypes.number.isRequired,
        benchmark: PropTypes.number,
        style: PropTypes.string,
        size: PropTypes.string,
    })),
    summary: PropTypes.shape({
        label: PropTypes.string.isRequired,
        stat: PropTypes.number.isRequired,
        style: PropTypes.string,
        size: PropTypes.string,
    }),
    onAddData: PropTypes.func.isRequired
};

export default MetricsShare;
