import React from 'react';

import Sidebar from '../components/Sidebar';
import Button from '../components/Button';
import Input from '../components/Input';

import '../css/applications.css';

class Applications extends React.Component {
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
			app: [],
			searchTerm: ''
		};
	};

	async componentDidMount() {
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

		await this.fetchApp();
	}

	fetchApp = async () => {
		try {
			const response = await fetch('http://localhost:3000/application');
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			const data = await response.json();
			this.setState({ app: data });
		} catch (error) {
			console.error('Error fetching applications:', error);
		}
	};

	handleSearch = (event) => {
		this.setState({ searchTerm: event.target.value });
	};

	render() {
		const { app, searchTerm } = this.state;
		const filteredApp = app.filter(app =>
			(app.applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) || app.id.toString().includes(searchTerm))
		);

		return (
			<>
				<Sidebar
					avatar={this.state.user.avatar}
					name={this.state.user.name}
					role={this.state.user.role}
					active='applications'
				/>
				<main id='applicationsMain'>
					<header id='header'>
						<h4>Online Applications</h4>
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
									<th>Pet ID</th>
									<th>Status</th>
									<th>Actions</th>
								</tr>
							</thead>
							<tbody>
								{filteredApp.map((app) => (
									<tr key={app.id}>
										<td>{app.id}</td>
										<td>{app.aStaffInfo.Username}</td>
										<td>{app.applicant.name}</td>
										<td>{app.petData.id}</td>
										<td>{app.status}</td>
										<td>
											<Button
												title='View'
												size='small'
												onClick={() => {
													window.location.hash = `/app/${app.id}`;
												}}
											/>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</section>
				</main>
			</>
		)
	};
};

export default Applications;
