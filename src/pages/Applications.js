import React from 'react';

import Sidebar from '../components/Sidebar';
import Button from '../components/Button';
import Input from '../components/Input';

import '../css/applications.css';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

class Applications extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			user: {
				avatar: '',
				name: '',
				branches: '',
				username: ''
			},
			app: {
				pending: [],
				approved: [],
				rejected: []
			},
			filtered: {
				pending: [],
				approved: [],
				rejected: []
			},
			displayType: 'pending'
		};
	};

	async componentDidMount() {
		fetch('https://compawnion-backend.onrender.com/admins/me', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${localStorage.getItem('token')}`
			}
		})
			.then(res => res.json())
			.then(async res => {
				try {
					this.setState({
						user: {
							avatar: res.aStaffInfo.Picture,
							name: res.aStaffInfo.Name,
							branches: res.aStaffInfo.Branches,
							username: res.aStaffInfo.Username
						}
					});
				} catch (error) {
					localStorage.removeItem('token');
					await MySwal.fire({
						title: <h4>Session Expired</h4>,
						html: <p>Please login again.</p>,
						icon: 'error',
						iconColor: 'var(--primary-color)',
						confirmButtonColor: 'var(--primary-color)'
					});
					window.location.hash = '/login';
				};
			});

		await this.fetchApp();
	}

	fetchApp = async () => {
		try {
			const response = await fetch('https://compawnion-backend.onrender.com/application/all');
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			const data = await response.json();
			this.setState({
				app: data,
				filtered: data
			});
		} catch (error) {
			console.error('Error fetching applications:', error);
		}
	};

	handleSearch = (event) => {
		const query = event.target.value;
		const pending = this.state.app.pending.filter(app =>
			app.applicant.name.firstName.toLowerCase().includes(query.toLowerCase())
			|| app.id.toLowerCase().includes(query.toLowerCase())
		);
		this.setState({
			filtered: {
				pending
			}
		});
	};

	render() {
		return (
			<>
				<Sidebar
					avatar={this.state.user.avatar}
					name={this.state.user.name}
					branches={this.state.user.branches}
					active='applications'
				/>
				<main id='applicationsMain'>
					<header id='header'>
						<h4>Online Applications</h4>
						<div>
							{
								this.state.displayType === 'pending' &&
								<Button
									title='Rejected'
									size='small'
									theme='dark'
									onClick={() => this.setState({ displayType: 'rejected' })}
								/>
							}
							{
								this.state.displayType === 'rejected' &&
								<Button
									title='Pending'
									size='small'
									theme='dark'
									onClick={() => this.setState({ displayType: 'pending' })}
								/>
							}
						</div>
					</header>

					<section id='applications'>
						<Input
							type='search'
							placeholder='Search for Name or ID'
							onChange={this.handleSearch}
							icon={
								<svg viewBox='0 0 17 15' fill='transparent'>
									<path d='M11.5485 8.68585C11.839 8.01588 12 7.27674 12 6.5C12 3.46243 9.53757 1 6.5 1C3.46243 1 1 3.46243 1 6.5C1 9.53757 3.46243 12 6.5 12C7.72958 12 8.86493 11.5965 9.78085 10.9147M11.5485 8.68585L14.8235 10.8921C15.4731 11.3297 15.6449 12.2109 15.2073 12.8605C14.7698 13.51 13.8885 13.6819 13.239 13.2443L9.78085 10.9147M11.5485 8.68585C11.1629 9.57534 10.549 10.3429 9.78085 10.9147' stroke='var(--primary-complement)' strokeWidth='2' />
								</svg>
							}
						/>
						<table id='applicationList'>
							<thead>
								<tr>
									<th>ID</th>
									<th>Date & Time</th>
									<th>Name</th>
									<th>Application Type</th>
									<th>Status</th>
									<th>Action</th>
								</tr>
							</thead>
							<tbody>
								{
									this.state.displayType == 'pending' &&
									this.state.filtered.pending.map((app, index) => {
										return (
											<tr key={index}>
												<td>{app.id}</td>
												<td>{app.dateOfSubmission}</td>
												<td>{app.applicant.name.firstName}</td>
												<td>{app.applicationType}</td>
												<td>{app.status}</td>
												<td>
													<Button
														title='View'
														size='small'
														href={`#/applications/${app.id}`}
													/>
												</td>
											</tr>
										);
									})
								}
								{
									this.state.displayType == 'rejected' &&
									this.state.filtered.rejected.map((app, index) => {
										return (
											<tr key={index}>
												<td>{app.id}</td>
												<td>{app.dateOfSubmission}</td>
												<td>{app.applicant.name.firstName}</td>
												<td>{app.applicationType}</td>
												<td>{app.status}</td>
												<td>
													<Button
														title='View'
														size='small'
														href={`#/applications/${app.id}`}
													/>
												</td>
											</tr>
										);
									})
								}
							</tbody>
						</table>
					</section>
				</main>
			</>
		)
	};
};

export default Applications;
