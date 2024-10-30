import React from 'react';

import Button from './Button';

class PetCard extends React.Component {
	render() {
		return (
			<div
				id={this.props.id}
				className={`petCard ${this.props.className} ${this.props.dark === 'true' ? 'dark' : ''}`}
			>
				<img src={this.props.image} alt={this.props.name} />
				<h5>{this.props.name}</h5>
				<p>{this.props.description}</p>
				<Button
					href={this.props.href}
					size='small'
					title='aboutMe'
				>
					Edit Info
				</Button>
			</div>
		)
	};
};

export default PetCard;