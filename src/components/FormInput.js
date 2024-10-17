import React from 'react';

import Button from './Button';

class FormInput extends React.Component {
	componentDidMount() {
		const input = document.getElementById(this.props.id);
		// Listen for Enter key press
		input.addEventListener('keyup', (event) => {
			if (event.key === 'Enter') {
				this.props.onEnter ? this.props.onEnter() : null;
			};
		});
	};

	render() {
		if (this.props.type === 'dropdown') return (
			<div className='formInput'>
				<label htmlFor={this.props.id}><h6>{this.props.label}</h6></label>
				<select
					id={this.props.id}
					name={this.props.name}
					value={this.props.value}
					onChange={this.props.onChange}
					disabled={this.props.disabled}
				>
					{this.props.options.map((option, index) => {
						return (
							<option key={index} value={option.value}>{option.label}</option>
						);
					})}
				</select>
			</div>
		);

		if (this.props.type === 'textarea') return (
			<div className='formInput'>
				<label htmlFor={this.props.id}><h6>{this.props.label}</h6></label>
				<textarea
					id={this.props.id}
					name={this.props.name}
					placeholder={this.props.placeholder}
					value={this.props.value}
					onChange={this.props.onChange}
					disabled={this.props.disabled}
				/>
			</div>
		);

		if (this.props.type === 'file') return (
			<div className='formInput'>
				<label htmlFor={this.props.id}><h6>{this.props.label}</h6></label>
				<input
					type={this.props.type}
					id={this.props.id}
					name={this.props.name}
					placeholder={this.props.placeholder}
					value={this.props.value}
					onChange={this.props.onChange}
					disabled={this.props.disabled}
				/>
				<Button
					label='Upload'
					type='button'
					onClick={this.props.onClick}
				/>
			</div>
		);

		return (
			<div className='formInput'>
				<label htmlFor={this.props.id}><h6>{this.props.label}</h6></label>
				<input
					type={this.props.type}
					id={this.props.id}
					name={this.props.name}
					placeholder={this.props.placeholder}
					value={this.props.value}
					onChange={this.props.onChange}
					disabled={this.props.disabled}
				/>
			</div>
		);
	};
};

export default FormInput;