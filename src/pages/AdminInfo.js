import React from 'react';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

import Sidebar from '../components/Sidebar';
import Button from '../components/Button';
import Popup from '../components/Popup';
import FormInput from '../components/FormInput';

import '../css/adminInfo.css';

class AdminInfo extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			user: {
				avatar: '',
				name: '',
				branches: '',
				username: '',
				id: '',
				email: '',
				phone: ''
			},
			aStaffInfo: {
				Name: '',
				Picture: '',
				Username: '',
				Password: '',
				Email: '',
				Mobilenumber: '',
				Branches: ''
			},
			admin: {
				id: '',
				LastLogout: null,
				LastLogin: '',
				token: '',
				aStaffInfo: {
					Name: '',
					Picture: '',
					Username: '',
					Password: '',
					Email: '',
					Mobilenumber: '',
					Branches: ''
				}
			},
			popupContent: <></>,
			saveDisabled: false,
			id: 0
		};
	};
	componentDidMount() {
		fetch('https://compawnion-backend.onrender.com/admins/me', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${localStorage.getItem('token')}`
			}
		})
			.then(res => res.json())
			.then(res => {
				try {
					this.setState({
						user: {
							avatar: res.aStaffInfo.Picture,
							name: res.aStaffInfo.Name,
							branches: res.aStaffInfo.Branches,
							username: res.aStaffInfo.Username,
							id: res.id,
							email: res.aStaffInfo.Email,
							phone: res.aStaffInfo.Mobilenumber
						},
						aStaffInfo: res.aStaffInfo,
						admin: res
					});
				} catch (error) {
					localStorage.removeItem('token');
					window.location.hash = '/login';
				};
			});
	};

	saveAdminInfo = async (e) => {
		this.saveDisabled = true;
		const admin = this.state.admin;
		const AdminId = location.hash.split('/').pop();
		const Name = this.state.admin.aStaffInfo.Name;
		const Email = this.state.admin.aStaffInfo.Email;
		const Mobilenumber = this.state.admin.aStaffInfo.Mobilenumber;
		console.log(admin);


		admin.Name = Name;
		admin.Email = Email;
		admin.Mobilenumber = Mobilenumber;
		delete admin.id;

		if (!Name || !Email || !Mobilenumber) {
			MySwal.fire({
				title: <h4>Error</h4>,
				html: <p>Please fill in all fields.</p>,
				width: '60rem',
				icon: 'error',
				iconColor: 'var(--primary-color)',
				confirmButtonText: 'Ok',
				confirmButtonColor: 'var(--primary-color)'
			});
			this.saveDisabled = false;
			return;
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(Email)) {
			MySwal.fire({
				title: <h4>Error</h4>,
				html: <>
					<p>Invalid email format.</p>
					<p>Please enter a valid email address.</p>
				</>,
				width: '60rem',
				icon: 'error',
				iconColor: 'var(--primary-color)',
				confirmButtonText: 'Ok',
				confirmButtonColor: 'var(--primary-color)'
			});
			this.saveDisabled = false;
			return;
		}

		if (Mobilenumber.length !== 11) {
			MySwal.fire({
				title: <h4>Error</h4>,
				html: <p>Phone number must be exactly 11 digits.</p>,
				width: '60rem',
				icon: 'error',
				iconColor: 'var(--primary-color)',
				confirmButtonText: 'Ok',
				confirmButtonColor: 'var(--primary-color)'
			});
			this.saveDisabled = false;
			return;
		}

		const PhoneRegex = /^[0-9]*$/;
		if (!PhoneRegex.test(Mobilenumber)) {
			MySwal.fire({
				title: <h4>Error</h4>,
				html: <p>Phone number must contain only numbers.</p>,
				width: '60rem',
				icon: 'error',
				iconColor: 'var(--primary-color)',
				confirmButtonText: 'Ok',
				confirmButtonColor: 'var(--primary-color)'
			});
			this.saveDisabled = false;
			return;
		}

		const send = async () => {
			fetch(`https://compawnion-backend.onrender.com/admins/${this.state.user.id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(admin)
			})
				.then(async res => {
					if (!res.ok) {
						const message = await res.json();
						throw new Error(message.message);
					}
					return res.json();
				})
				.then(() => {
					MySwal.fire({
						title: <h4>Success</h4>,
						html: <p>Admin updated successfully.</p>,
						width: '60rem',
						icon: 'success',
						confirmButtonText: 'Ok',
						confirmButtonColor: 'var(--primary-color)'
					}).then(() => {
						window.location.reload();
					});
					this.saveDisabled = false;
				})
				.catch(err => {
					MySwal.fire({
						title: <h4>Error</h4>,
						html: <>
							<p>Failed to update admin.</p>
							<p>{err.message}</p>
						</>,
						width: '60rem',
						icon: 'error',
						iconColor: 'var(--primary-color)',
						confirmButtonText: 'Ok',
						confirmButtonColor: 'var(--primary-color)'
					});
					this.saveDisabled = false;
				});
		};

		const imageInput = document.getElementById('imageInput').files[0];
		if (imageInput instanceof Blob) {
			const reader = new FileReader();
			reader.readAsDataURL(imageInput);
			reader.onload = async () => {
				admin.Picture = reader.result;
				await send();
			};
		} else {
			send();
		}
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
					branches={this.state.user.branches}

					active='rescues'
				/>

				<form id='addRescuedPetMain'>
					<header id='header'>
						<h4>Admin Info</h4>
						<div>
							<Button
								title='Save'
								id='save'
								onClick={this.saveAdminInfo}
								disabled={this.state.saveDisabled}
							/>
						</div>
					</header>

					<section id='basicInfo'>
						<div id='image'>
							<input type='file' name='imageInput' id='imageInput' accept="image/*" />
							<div
								id='img'
								onClick={() => {
									const imageInput = document.getElementById('imageInput');
									imageInput.onchange = () => {
										const file = imageInput.files[0];
										const img = document.getElementById('img');
										const reader = new FileReader();

										reader.onload = (e) => {
											img.style.backgroundImage = `url(${e.target.result})`;
										};

										if (file) reader.readAsDataURL(file);
									};

									imageInput.click();
								}}

								style={{
									backgroundImage: this.state.admin.aStaffInfo.Picture ? `url(${this.state.admin.aStaffInfo.Picture})` : ''
								}}
							/>
							<Button
								title='Upload Image'
								theme='dark'
								fill='outline'

								onClick={() => {
									const img = document.getElementById('img');
									img.click();
								}}
							/>
						</div>

						<div>
							<FormInput
								label='Name'
								type='text'
								id='Name'
								name='Name'
								placeholder='Name'
								value={this.state.admin.aStaffInfo.Name}
								defaultValue={this.state.admin.aStaffInfo.Name}
								onChange={(e) => {
									this.setState({
										admin: {
											...this.state.admin,
											aStaffInfo: {
												...this.state.admin.aStaffInfo,
												Name: e.target.value
											}
										}
									});
								}}
							/>
							<FormInput
								label='Type'
								type='text'
								id='Username'
								name='type'
								placeholder='Username'
								disabled={true}
								value={this.state.admin.aStaffInfo.Username}
								defaultValue={this.state.admin.aStaffInfo.Username}
							/>
							<FormInput
								label='Branch'
								type='text'
								id='Branches'
								name='Branches'
								placeholder='Branch'
								disabled={true}
								value={this.state.admin.aStaffInfo.Branches}
								defaultValue={this.state.admin.aStaffInfo.Branches}
							/>
						</div>
						<div>
							<FormInput
								label='Admin'
								type='text'
								id='Admin'
								name='Admin'
								disabled={true}
								value={this.state.user.id}
								defaultValue={this.state.user.id}
							/>
							<FormInput
								label='Email'
								type='test'
								id='Email'
								name='Email'
								placeholder='Email'
								value={this.state.admin.aStaffInfo.Email}
								defaultValue={this.state.admin.aStaffInfo.Email}
								onChange={(e) => {
									this.setState({
										admin: {
											...this.state.admin,
											aStaffInfo: {
												...this.state.admin.aStaffInfo,
												Email: e.target.value
											}
										}
									});
								}}
							/>
							<FormInput
								label='Phone Number'
								type='number'
								id='Mobilenumber'
								name='Mobilenumber'
								placeholder='Phone Number'
								value={this.state.admin.aStaffInfo.Mobilenumber}
								defaultValue={this.state.admin.aStaffInfo.Mobilenumber}
								onChange={(e) => {
									this.setState({
										admin: {
											...this.state.admin,
											aStaffInfo: {
												...this.state.admin.aStaffInfo,
												Mobilenumber: e.target.value
											}
										}
									});
								}}
							/>
						</div>
					</section>
				</form>
			</>
		);
	}
};

export default AdminInfo;