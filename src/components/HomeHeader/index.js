import React from 'react';
import { NavLink } from 'react-router-dom';
import { HamburgerButton } from 'react-hamburger-button';
import AnchorLink from 'react-anchor-link-smooth-scroll';
import './index.css';

export default class HomeHeader extends React.Component {
	constructor() {
		super();

		this.state = {
			open: false,
		}
	}
	updateDimensions = e => {
		if (window.innerWidth > 700) {
			this.setState({open: false});
		}
	}
	componentDidMount() {
		this.updateDimensions();
		window.addEventListener('resize', this.updateDimensions.bind(this));
	}
	componentWillUnmount() {
		window.removeEventListener('resize', this.updateDimensions.bind(this));
	}
	render() {
		return (
			<div className="homeheader">
				<div className="sizer">
					<div className="logo">
						<NavLink to="/">
							<h1>weve.</h1>
						</NavLink>
					</div>
					<div className="menu">
						<nav>
							<ul>
								<li><NavLink to="/">Home</NavLink></li>
								<li><AnchorLink href="#features">Features</AnchorLink></li>
								<li><AnchorLink href="#technology">Technology</AnchorLink></li>
								<li><NavLink to="/login">Login</NavLink></li>
							</ul>
						</nav>
						<div className="hamburger">
							<HamburgerButton
								open={this.state.open}
								onClick={() => this.setState(previous => ({open: !previous.open}))}
								width={25}
								height={12}
								strokeWidth={2}
								color='#8991A9'
								animationDuration={0.5}
							/>
						</div>
					</div>
					<div className={`menu-mobile ${this.state.open ? "shown" : "hidden"}`}>
						<nav>
							<ul>
								<li><NavLink to="/">Home</NavLink></li>
								<li><AnchorLink onClick={this.state.open ? () => this.setState({open: false}) : null} href="#features">Features</AnchorLink></li>
								<li><AnchorLink onClick={this.state.open ? () => this.setState({open: false}) : null} href="#technology">Technology</AnchorLink></li>
								<li><NavLink to="/login">Login</NavLink></li>
							</ul>
						</nav>
					</div>
				</div>
			</div>
		);
	}
}
