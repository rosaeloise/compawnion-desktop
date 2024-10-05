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
				name: {
					first: '',
					last: ''
				},
				role: '',
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
				totalPending: 0,
				total: []
			}
		};
	};
	componentDidMount() {
		setInterval(() => {
			this.setState({
				time: {
					hours: (new Date().getHours() % 12 || 12) < 10 ? `0${new Date().getHours() % 12 || 12}` : new Date().getHours() % 12 || 12,
					minutes: new Date().getMinutes(),
					period: new Date().getHours() >= 12 ? 'PM' : 'AM',
					month: new Date().toLocaleString('default', { month: 'long' }).toUpperCase(),
					day: new Date().getDate()
				}
			});
		}, 10);
		setTimeout(() => {
			this.setState({
				loading: false,
				user: {
					avatar: 'https://scontent.fmnl8-1.fna.fbcdn.net/v/t1.6435-9/98343921_3964488750260462_3832610965619212288_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=dd6889&_nc_eui2=AeGm5O07sV4g2mWQJmqJ1-O-377aGaUqoBLfvtoZpSqgEsD_5TyQ1z8RgL1MZRyaVA-j34PtB1K_aLxqUbhLceQH&_nc_ohc=ki5IaXRBJwcQ7kNvgEkKQkZ&_nc_ht=scontent.fmnl8-1.fna&oh=00_AYAb4j1j4QVfh2vd-O-S1_AsIqj5A9mtV2U15ySydQl4TA&oe=6724C727',
					name: {
						first: 'Gumoan',
						last: 'Magsaysay'
					},
					role: 'Administrator',
					username: 'gumoan'
				}
			});
		}, 1000);
		setTimeout(() => {
			this.setState({
				shedule: {
					totalPending: 3,
					total: [
						{
							id: 1,
							time: '6:30 PM',
							type: 'Onsite Interview'
						},
						{
							id: 2,
							time: '7:00 PM',
							type: 'Online Interview'
						},
						{
							id: 3,
							time: '7:30 PM',
							type: 'Onsite Interview'
						}
					]
				}
			});
		}, 2000);
	};
	render() {
		return (
			<>
				<Sidebar
					avatar={this.state.user.avatar}
					name={this.state.user.name.first + ' ' + this.state.user.name.last}
					role={this.state.user.role}

					active='dashboard'
				/>

				<main id='main'>
					<div id='helloUser'>
						<h1>Hello,<br />{this.state.user.name.first}!</h1>
						<p>{`@${this.state.user.username}`}</p>
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
									<th>Time</th>
									<th>Application Type</th>
								</tr>
							</thead>
							<tbody>
								{
									this.state.shedule.total.map((schedule, index) => {
										return (
											<tr key={index}>
												<td>{schedule.time}</td>
												<td>{schedule.type}</td>
											</tr>
										)
									})
								}
							</tbody>
						</table>
						<svg viewBox="0 0 549 561">
<path d="M519.066 352.515C531.668 396.214 508.404 454.535 478.256 461.22C416.663 490.041 395.446 439.928 347.193 452.452C298.94 464.975 325.105 500.968 248.827 533.6C216.462 545.165 129.729 503.765 116.259 457.057C85.8276 351.537 136.031 197.362 247.263 168.494C358.495 139.625 488.635 246.995 519.066 352.515Z" fill="var(--primary-color)"/>
<path d="M123.358 165.597C142.557 196.878 135.743 230.64 118.237 240.31C97.4745 251.778 61.2965 242.151 42.0968 210.869C22.8972 179.588 21.8298 130.224 42.5918 118.756C67.1961 120.615 104.158 134.315 123.358 165.597Z" fill="var(--primary-color)"/>
<path d="M219.283 71.968C233.492 105.562 236.993 140.396 214.696 148.883C192.399 157.371 162.805 137.017 148.596 103.423C134.386 69.8283 145.071 49.0058 167.368 40.5185C189.665 32.0313 205.073 38.3735 219.283 71.968Z" fill="var(--primary-color)"/>
<path d="M355.034 67.2813C354.169 103.47 333.996 132.388 309.977 131.871C285.959 131.354 272.321 112.159 273.186 75.9701C273.546 60.9236 283.717 48.675 288.604 35.6024C295.472 17.2336 299.079 0.518104 313.111 0.820071C337.13 1.33694 355.899 31.0926 355.034 67.2813Z" fill="var(--primary-color)"/>
<path d="M469.478 121.229C467.487 138.305 461.189 146.345 448.799 158.117C439.401 170.148 431.19 183.153 418.644 181.837C394.765 179.331 378.808 148.133 383.003 112.155C387.198 76.1761 409.957 49.0411 433.836 51.5469C457.716 54.0528 473.673 85.2505 469.478 121.229Z" fill="var(--primary-color)"/>
</svg>
					</div>

					<div id='total'></div>
					<div id='pending'></div>
				</main>
			</>
		)
	};
};

export default Dashboard;