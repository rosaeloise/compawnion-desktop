import React from 'react';

class Button extends React.Component {
	render() {
		if (this.props.href) {
			return (
				<a
					className={`button ${this.props.fill === 'outline' ? 'outlined' : 'filled'} ${this.props.theme === 'dark' ? 'dark' : 'light'}`}

					href={this.props.href}
					title={this.props.title}
					id={this.props.id}
				>
					{
						this.props.size === 'Small' ?
							<h6>{this.props.children || this.props.title}</h6> :
							<h5>{this.props.children || this.props.title}</h5>
					}
				</a>
			)
		};
		return (
			<button
				className={`button ${this.props.fill === 'outline' ? 'outline' : 'fill'} ${this.props.theme === 'dark' ? 'dark' : 'light'}`}
				type={this.props.type || 'button'}
				onClick={this.props.onClick}
				id={this.props.id}
			>
				{
					this.props.size === 'Small' ?
						<p>{this.props.children || this.props.title}</p> :
						<h6>{this.props.children || this.props.title}</h6>
				}
			</button>
		)
	};
};

export default Button;