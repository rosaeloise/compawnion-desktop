import React from 'react';

import Button from './Button';

class PetCard extends React.Component {
	render() {
		return (
			<div
				className={`petCard ${this.props.className} ${this.props.dark === 'true' ? 'dark' : ''}`}
			>
				<img src={this.props.image} alt={this.props.name} />
				<h5>{this.props.name}</h5>
				<p>{this.props.description}</p>
				<Button
					href={this.props.href}
					size='small'
					fill='outline'
					title='aboutMe'
				>
					About Me
				</Button>
			</div>
		)
	};
};

export default PetCard;