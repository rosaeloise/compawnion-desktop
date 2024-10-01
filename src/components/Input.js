import React from 'react';

class Input extends React.Component {
	render() {
		return (
			<input
				className='input'
				placeholder={this.props.placeholder}
				type={this.props.type}
			/>
		);
	};
};

export default Input;