import React from 'react';
import PropTypes from 'prop-types';
import FormTemplate from '../FormTemplate';
import connectToTemplate from '../wrappers/connectToTemplate';

function Profile(props) {
    const { template, showOn, hideOn } = props;

    const isInActiveProfiles = profile => template.getActiveProfiles().find(activeProfile => activeProfile===profile) !== undefined;

    if(hideOn && hideOn.length > 0){
        const shouldBeEmpty = hideOn.filter(profile => isInActiveProfiles(profile));
        if (shouldBeEmpty.length > 0){
            return '';
        }
    }

    if(showOn && showOn.length > 0){
        const shouldBeFilled = showOn.filter(profile => isInActiveProfiles(profile));
        if (shouldBeFilled.length === 0){
            return '';
        }
    }

    return (
        <React.Fragment>
            {props.children}
        </React.Fragment>
    );
}

Profile.propTypes = {
    template: PropTypes.instanceOf(FormTemplate).isRequired,
    children: PropTypes.node.isRequired,
    showOn: PropTypes.arrayOf(PropTypes.string),
    hideOn: PropTypes.arrayOf(PropTypes.string),
};

export default connectToTemplate(Profile);