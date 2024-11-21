import React from 'react';

import Sidebar from '../components/Sidebar';
import Button from '../components/Button';
import Popup from '../components/Popup';
import FormInput from '../components/FormInput';

import '../css/appDetails.css';

class CompawnionInfo extends React.Component {
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
			popupContent: <></>,
			vaccinationCount: 1,
			vaccination: [
				{
					name: null,
					date: null,
					expiry: null
				}
			],
			medicalHistoryCount: 1,
			medicalHistory: [
				{
					date: null,
					procedure: null,
					notes: null
				}
			],
			petID: 0
		};
	};
	componentDidMount() {
		fetch('http://localhost:3000/admins/me', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
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

		const appID = (() => {
			const url = window.location.href;
			const id = url.split('/');
			return id[id.length - 1];
		})();

		fetch(`http://localhost:3000/compawnions/${appID}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		}).then(res => res.json())
			.then(res => {
				this.setState({
					compawnion: res
				});
			});
	};
	render() {
		return (
			<>
				<Popup>
					{this.state.popupContent}
				</Popup>

				<Sidebar
					avatar={this.state.user.avatar}
					name={this.state.user.name}
					role={this.state.user.role}

					active='compawnions'
				/>

				<form id='appDetailsMain'>
					<header id='header'>
						<h4>Application Info</h4>
						<div>
							<Button
								title='Save'
								id='save'
							/>
							<Button
								title='Cancel'
								theme='dark'

								onClick={() => {
									window.location.hash = '/applications';
								}}
							/>
						</div>
					</header>

					<section id='basicInfo'>
						<div>
							<FormInput
								label='Application ID'
								type='text'
								id='name'
								name='name'
								disabled={true}
							/>
							<FormInput
								label='Name'
								type='text'
								id='type'
								name='type'
								disabled={true}
							/>
						</div>
						<div>
							<FormInput
								label='Username'
								type='text'
								id='petID'
								name='petID'
								disabled={true}
							/>
							<FormInput
								label='Status'
								type='text'
								id='breed'
								name='breed'
								disabled={true}
							/>
						</div>
						<div>
							<h6>Application Details</h6>
							<Button
								title='View Application Form'
							/>
							<Button
								title='View Pets Information'
							/>
						</div>
					</section>

					<section id='backgroundInfo'>
						<h6>Online Interview Schedule</h6>
						<div>
							<FormInput
								label='Room Link'
								type='text'
								id='personality'
								name='personality'
								placeholder='Enter Room Link'
							/>
							<FormInput
								label='Date'
								type='date'
								id='backgroundStory'
								name='backgroundStory'

							/>
							<FormInput
								label='Time'
								type='time'
								id='rescueDate'
								name='rescueDate'
							/>
						</div>

						<h6>Onsite Interview Schedule</h6>
						<div>
							<FormInput
								label='Date'
								type='date'
								id='weight'
								name='weight'
							/>
						</div>
					</section>

					<section id='buttons'>
						<Button
							title='Print Contract'
						/>
						<Button
							title='Approve'
						/>
						<Button
							title='Decline'
						/>
					</section>
				</form>
			</>
		)
	};
};

export default CompawnionInfo;