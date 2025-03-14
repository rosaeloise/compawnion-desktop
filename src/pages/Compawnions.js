import React from 'react';
import Sidebar from '../components/Sidebar';
import Input from '../components/Input';
import '../css/compawnions.css';
import Button from '../components/Button';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

class Compawnions extends React.Component {
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
				filtered: [],
				message: ''
			}
		};
	};
	componentDidMount() {
		fetch('https://compawnion-backend.onrender.com/admins/me', {
			method: 'GET',
			headers: {
				'Content-Type': 'compawnions/json',
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

		fetch('https://compawnion-backend.onrender.com/compawnions/', {
			method: 'GET',
			headers: {
				'Content-Type': 'compawnions/json',
				'Authorization': `Bearer ${localStorage.getItem('token')}`
			}
		}).then(res => res.json())
			.then(res => {
				this.setState({
					compawnions: {
						...res,
						filtered: res.data
					}
				});
			});
	};
	handleSearch = (e) => {
		const search = e.target.value;
		const filtered = this.state.compawnions.data.filter(compawnion => {
			return compawnion.CompawnionUser.accountCreate.Username.toLowerCase().includes(search.toLowerCase()) ||
				compawnion.CompawnionUser.appPetID?.toLowerCase().includes(search.toLowerCase()) ||
				compawnion.id.toLowerCase().includes(search.toLowerCase()) ||
				compawnion.CompawnionUser.accountCreate.Email.toLowerCase().includes(search.toLowerCase());
		});
		this.setState({
			compawnions: {
				...this.state.compawnions,
				filtered: filtered
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

					active='compawnions'
				/>
				<main id='compawnionsMain'>
					<header id='header'>
						<h4>Compawnion Users</h4>
					</header>

					<section id='compawnions'>
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
						<table id='compawnionsList'>
							<thead>
								<tr>
									<th>ID</th>
									<th>Username</th>
									<th>Email</th>
									<th>Applicant ID</th>
									<th>Status</th>
									<th>Action</th>
								</tr>
							</thead>
							<tbody>
								{
									this.state.compawnions.filtered.map((compawnion, index) => {
										return (
											<tr key={index}>
												<td>{compawnion.id}</td>
												<td>{compawnion.CompawnionUser.accountCreate.Username}</td>
												<td>{compawnion.CompawnionUser.accountCreate.Email}</td>
												<td>{compawnion.CompawnionUser.appPetID}</td>
												<td>{compawnion.Status}</td>
												<td>
													<Button
														type='button'
														title='View'
														size='small'
														href={`#/compawnions/${compawnion.id}`}
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

export default Compawnions;