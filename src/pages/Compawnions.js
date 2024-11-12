import React from 'react';

import Sidebar from '../components/Sidebar';
import Input from '../components/Input';

import '../css/compawnions.css';
import Button from '../components/Button';

class AppDetails extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			user: {
				avatar: '',
				name: '',
				role: '',
				username: ''
			},
			compawnions: {
				data: [
					{
						"id": "024",
						"CompawnionUser": {
							"MedSched": [],
							"TrustedVet": [],
							"CompawnionSched": [],
							"accountCreate": {
								"Username": "Neon",
								"Email": "zedrama30@gmail.com",
								"Password": "$2b$10$vhbgBm0QO2a3BCQUsxf1ous2QjpdxyXgcTYEFIKS9VkOElkef99d6"
							},
							"appPetID": "92014"
						},
						"LastLogout": null,
						"Status": "Active",
						"LastLogin": "2024-11-12T09:05:42.741Z"
					}
				],
				message: ''
			}
		};
	};
	componentDidMount() {
		fetch('http://localhost:3000/admins/me', {
			method: 'GET',
			headers: {
				'Content-Type': 'compawnions/json',
				'Authorization': `Bearer ${localStorage.getItem('token')}`
			}
		})
			.then(res => res.json())
			.then(res => {
				this.setState({
					user: {
						avatar: res.aStaffInfo.Picture,
						name: res.aStaffInfo.Name,
						role: res.aStaffInfo.Branches,
						username: res.aStaffInfo.Username
					}
				});
			});

		fetch('http://localhost:3000/compawnions/', {
			method: 'GET',
			headers: {
				'Content-Type': 'compawnions/json',
				'Authorization': `Bearer ${localStorage.getItem('token')}`
			}
		}).then(res => res.json())
			.then(res => {
				this.setState({
					compawnions: res
				});
			});
	};
	render() {
		return (
			<>
				<Sidebar
					avatar={this.state.user.avatar}
					name={this.state.user.name}
					role={this.state.user.role}

					active='compawnions'
				/>
				<form id='addRescuedPetMain'>
					<header id='header'>
						<h4>Add New Rescued Pet</h4>
						<div>
							<Button
								title='Save'
								id='save'
							/>
							<Button
								title='Cancel'
								theme='dark'

								onClick={() => {
									window.location.hash = '/rescues';
								}}
							/>
						</div>
					</header>

					<section id='basicInfo'>
						<div>
							<FormInput
								label='Name'
								type='text'
								id='name'
								name='name'
								placeholder='Enter pet name'
							/>
						</div>
					</section>
				</form>
			</>
		)
	};
};

export default AppDetails;