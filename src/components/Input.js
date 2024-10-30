import React from 'react';

class Input extends React.Component {
	render() {
		if (this.props.icon) {
			return (
				<div className='inputDiv'>
					{this.props.icon}
					<input
						icon={this.props.icon}
						className={`input ${this.props.icon ? 'icon' : ''}`}
						placeholder={this.props.placeholder}
						type={this.props.type}
						id={this.props.id}
						onKeyDown={this.props.onKeyDown}
						onChange={this.props.onChange}
					/>
				</div>
			);
		}
		return (
			<input
				icon={this.props.icon}
				className={`input ${this.props.icon ? 'icon' : ''}`}
				placeholder={this.props.placeholder}
				type={this.props.type}
				id={this.props.id}
				onKeyDown={this.props.onKeyDown}
				onChange={this.props.onChange}
			/>
		);
	};
};

export default Input;