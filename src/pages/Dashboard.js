import React from 'react';

import Sidebar from '../components/Sidebar';

import '../css/dashboard.css';

class Dashboard extends React.Component {
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
			time: {
				hours: 6,
				minutes: 32,
				period: 'AM',
				month: 'September',
				day: 29
			},
			shedule: {
				total: []
			},
			pending: []
		};
	};
	componentDidMount() {
		setInterval(() => {
			this.setState({
				time: {
					hours: ('00' + (new Date().getHours() % 12 || 12) % 12 || 12).slice(-2),
					minutes: ('00' + new Date().getMinutes()).slice(-2),
					period: new Date().getHours() >= 12 ? 'PM' : 'AM',
					month: new Date().toLocaleString('default', { month: 'long' }).toUpperCase(),
					day: new Date().getDate()
				}
			});
		}, 10);

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
							username: res.aStaffInfo.Username
						}
					});
				} catch (error) {
					localStorage.removeItem('token');
					window.location.href = '/login';
				};
			});

		// setTimeout(() => {
		// 	this.setState({
		// 		shedule: {
		// 			total: [
		// 				{
		// 					id: 1,
		// 					time: '6:30 PM',
		// 					type: 'Onsite Interview'
		// 				},
		// 				{
		// 					id: 2,
		// 					time: '7:00 PM',
		// 					type: 'Online Interview'
		// 				},
		// 				{
		// 					id: 3,
		// 					time: '7:30 PM',
		// 					type: 'Onsite Interview'
		// 				}
		// 			]
		// 		}
		// 	});
		// }, 2000);
		// setTimeout(() => {
		// 	this.setState({
		// 		pending: [
		// 			{
		// 				id: 1,
		// 				time: '8:00 PM',
		// 				type: 'Onsite Interview'
		// 			},
		// 			{
		// 				id: 2,
		// 				time: '8:30 PM',
		// 				type: 'Online Interview'
		// 			},
		// 			{
		// 				id: 3,
		// 				time: '9:00 PM',
		// 				type: 'Onsite Interview'
		// 			},
		// 			{
		// 				id: 4,
		// 				time: '9:30 PM',
		// 				type: 'Online Interview'
		// 			},
		// 			{
		// 				id: 5,
		// 				time: '10:00 PM',
		// 				type: 'Onsite Interview'
		// 			},
		// 			{
		// 				id: 6,
		// 				time: '10:30 PM',
		// 				type: 'Online Interview'
		// 			},
		// 			{
		// 				id: 7,
		// 				time: '11:00 PM',
		// 				type: 'Onsite Interview'
		// 			},
		// 			{
		// 				id: 8,
		// 				time: '11:30 PM',
		// 				type: 'Online Interview'
		// 			}
		// 		]
		// 	});
		// }, 3000);

		this.fetchApp();
	};

	fetchApp = async () => {
		try {
			const response = await fetch('https://compawnion-backend.onrender.com/application/all');
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			const data = await response.json();
			// {
			// 	"pending": [
			// 		{
			// 	"id": "060",
			// 	"termsAndCondission": true,
			// 	"paymentAgreement": true,
			// 	"applicationType": "Online Application",
			// 	"applicationAppId": "060",
			// 	"appPetID": null,
			// 	"petId": "029",
			// 	"applicant": {
			// 		"name": {
			// 			"firstName": "Ely Rose",
			// 			"middleName": "Abaricio",
			// 			"lastName": "Bosangit"
			// 		},
			// 		"birthdate": "2003-01-05",
			// 		"occupation": "Sales Consultant`",
			// 		"address": {
			// 			"country": "Philippines",
			// 			"province": "Rizal",
			// 			"cityOrMunicipality": "Rodriguez",
			// 			"baranggay": "San Jose",
			// 			"street": "Sub-Urban Phase 1F Blk 3",
			// 			"lot": "Lot 67"
			// 		},
			// 		"contact": {
			// 			"email": "bosangitelyrose05@gmail.com",
			// 			"phoneNumber": "91234567890",
			// 			"facebook": ""
			// 		}
			// 	},
			// 	"dwelling": {
			// 		"type": "Single-Storey House/Bungalow",
			// 		"ownership": "Owned",
			// 		"numberOfHouseMembers": "4",
			// 		"numberOfPets": "1-2",
			// 		"petsAllowedInHouse": "No",
			// 		"planningToMoveOut": "Yes"
			// 	},
			// 	"petCare": {
			// 		"petOwnershipExperience": "Recent pet-owner (Owned a pet 3 years or less)",
			// 		"veterinarian": "Pet Clinic"
			// 	},
			// 	"status": "Pending"
			// }
			// 	],
			// 	"approved": [
			// 		{
			// 	"id": "060",
			// 	"termsAndCondission": true,
			// 	"paymentAgreement": true,
			// 	"applicationType": "Online Application",
			// 	"applicationAppId": "060",
			// 	"appPetID": null,
			// 	"petId": "029",
			// 	"applicant": {
			// 		"name": {
			// 			"firstName": "Ely Rose",
			// 			"middleName": "Abaricio",
			// 			"lastName": "Bosangit"
			// 		},
			// 		"birthdate": "2003-01-05",
			// 		"occupation": "Sales Consultant`",
			// 		"address": {
			// 			"country": "Philippines",
			// 			"province": "Rizal",
			// 			"cityOrMunicipality": "Rodriguez",
			// 			"baranggay": "San Jose",
			// 			"street": "Sub-Urban Phase 1F Blk 3",
			// 			"lot": "Lot 67"
			// 		},
			// 		"contact": {
			// 			"email": "bosangitelyrose05@gmail.com",
			// 			"phoneNumber": "91234567890",
			// 			"facebook": ""
			// 		}
			// 	},
			// 	"dwelling": {
			// 		"type": "Single-Storey House/Bungalow",
			// 		"ownership": "Owned",
			// 		"numberOfHouseMembers": "4",
			// 		"numberOfPets": "1-2",
			// 		"petsAllowedInHouse": "No",
			// 		"planningToMoveOut": "Yes"
			// 	},
			// 	"petCare": {
			// 		"petOwnershipExperience": "Recent pet-owner (Owned a pet 3 years or less)",
			// 		"veterinarian": "Pet Clinic"
			// 	},
			// 	"status": "Pending"
			// }
			// 	],
			// 	"rejected": [
			// 		{
			// 	"id": "060",
			// 	"termsAndCondission": true,
			// 	"paymentAgreement": true,
			// 	"applicationType": "Online Application",
			// 	"applicationAppId": "060",
			// 	"appPetID": null,
			// 	"petId": "029",
			// 	"applicant": {
			// 		"name": {
			// 			"firstName": "Ely Rose",
			// 			"middleName": "Abaricio",
			// 			"lastName": "Bosangit"
			// 		},
			// 		"birthdate": "2003-01-05",
			// 		"occupation": "Sales Consultant`",
			// 		"address": {
			// 			"country": "Philippines",
			// 			"province": "Rizal",
			// 			"cityOrMunicipality": "Rodriguez",
			// 			"baranggay": "San Jose",
			// 			"street": "Sub-Urban Phase 1F Blk 3",
			// 			"lot": "Lot 67"
			// 		},
			// 		"contact": {
			// 			"email": "bosangitelyrose05@gmail.com",
			// 			"phoneNumber": "91234567890",
			// 			"facebook": ""
			// 		}
			// 	},
			// 	"dwelling": {
			// 		"type": "Single-Storey House/Bungalow",
			// 		"ownership": "Owned",
			// 		"numberOfHouseMembers": "4",
			// 		"numberOfPets": "1-2",
			// 		"petsAllowedInHouse": "No",
			// 		"planningToMoveOut": "Yes"
			// 	},
			// 	"petCare": {
			// 		"petOwnershipExperience": "Recent pet-owner (Owned a pet 3 years or less)",
			// 		"veterinarian": "Pet Clinic"
			// 	},
			// 	"status": "Pending"
			// }
			// 	]
			// }
			const pending = data.pending.map((application) => {
				return {
					id: application.id,
					type: application.applicationType
				};
			});
			const schedule = data.pending.filter((application) => {
				return application.schedules;
			}).filter((application) => {
				const epoch = new Date(0).setUTCSeconds(application.schedules.meetingDate._seconds);
				const now = new Date().getTime();
				const epocMonthYearDate = new Date(epoch).toLocaleDateString('en-US', { month: 'long', year: 'numeric', day: 'numeric' });
				const nowMonthYearDate = new Date(now).toLocaleDateString('en-US', { month: 'long', year: 'numeric', day: 'numeric' });
				return epocMonthYearDate === nowMonthYearDate;
			}).map((application) => {
				return {
					id: application.id,
					time: application.schedules.Time,
					type: application.applicationType
				};
			});
			console.log(schedule);

			this.setState({
				pending,
				shedule: {
					total: schedule
				}
			});	
		} catch (error) {
			console.error('Error fetching applications:', error);
		}
	};

	render() {
		return (
			<>
				<Sidebar
					avatar={this.state.user.avatar}
					name={this.state.user.name}
					branches={this.state.user.branches}

					active='dashboard'
				/>

				<main id='dashboardMain'>
					<div id='helloUser'>
						<h1>Hello,<br />{this.state.user.name}!</h1>
						<h6>{`@${this.state.user.username}`}</h6>
					</div>

					<div id='time'>
						<h1><span>{this.state.time.hours}:{this.state.time.minutes}</span><span>{this.state.time.period}</span></h1>
						<h3>{this.state.time.month}</h3>
						<h1>{this.state.time.day}</h1>
					</div>

					<div id='schedule'>
						<h4>Today's Schedule</h4>
						<table>
							<thead>
								<tr>
									<th>ID</th>
									<th>Time</th>
									<th>Application Type</th>
								</tr>
							</thead>
							<tbody>
								{
									this.state.shedule.total.map((schedule, index) => {
										return (
											<tr key={index}>
												<td>{schedule.id}</td>
												<td>{schedule.time}</td>
												<td>{schedule.type}</td>
											</tr>
										)
									})
								}
							</tbody>
						</table>
						<svg viewBox='0 0 549 561'>
							<path d='M519.066 352.515C531.668 396.214 508.404 454.535 478.256 461.22C416.663 490.041 395.446 439.928 347.193 452.452C298.94 464.975 325.105 500.968 248.827 533.6C216.462 545.165 129.729 503.765 116.259 457.057C85.8276 351.537 136.031 197.362 247.263 168.494C358.495 139.625 488.635 246.995 519.066 352.515Z' fill='var(--primary-color)' />
							<path d='M123.358 165.597C142.557 196.878 135.743 230.64 118.237 240.31C97.4745 251.778 61.2965 242.151 42.0968 210.869C22.8972 179.588 21.8298 130.224 42.5918 118.756C67.1961 120.615 104.158 134.315 123.358 165.597Z' fill='var(--primary-color)' />
							<path d='M219.283 71.968C233.492 105.562 236.993 140.396 214.696 148.883C192.399 157.371 162.805 137.017 148.596 103.423C134.386 69.8283 145.071 49.0058 167.368 40.5185C189.665 32.0313 205.073 38.3735 219.283 71.968Z' fill='var(--primary-color)' />
							<path d='M355.034 67.2813C354.169 103.47 333.996 132.388 309.977 131.871C285.959 131.354 272.321 112.159 273.186 75.9701C273.546 60.9236 283.717 48.675 288.604 35.6024C295.472 17.2336 299.079 0.518104 313.111 0.820071C337.13 1.33694 355.899 31.0926 355.034 67.2813Z' fill='var(--primary-color)' />
							<path d='M469.478 121.229C467.487 138.305 461.189 146.345 448.799 158.117C439.401 170.148 431.19 183.153 418.644 181.837C394.765 179.331 378.808 148.133 383.003 112.155C387.198 76.1761 409.957 49.0411 433.836 51.5469C457.716 54.0528 473.673 85.2505 469.478 121.229Z' fill='var(--primary-color)' />
						</svg>
					</div>

					<div id='total'>
						<h4>Total Pending</h4>
						<h1>{('000' + this.state.pending.length).slice(-3)}</h1>
					</div>

					<div id='pending'>
						<h4>Pending Applications</h4>
						<table>
							<thead>
								<tr>
									<th>ID</th>
									<th>Application Type</th>
								</tr>
							</thead>
							<tbody>
								{
									this.state.pending.map((pending, index) => {
										if (index >= 5) return;
										return (
											<tr key={index}>
												<td>{pending.id}</td>
												<td>{pending.type}</td>
											</tr>
										)
									})
								}
							</tbody>
						</table>
					</div>
				</main>
			</>
		)
	};
};

export default Dashboard;
