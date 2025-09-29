
document.addEventListener('DOMContentLoaded', () => {
	const modalWrappers = document.querySelectorAll('[data-modal]');
	const modalTriggers = document.querySelectorAll('[data-modal-target="dynamic-modal"]');
	const dynamicModal = document.getElementById('dynamic-modal');

	const modalTitle = dynamicModal.querySelector('#modal-title');
	const modalImage = dynamicModal.querySelector('#modal-image');
	const modalDescription = dynamicModal.querySelector('#modal-description');
	const modalCoordinator = dynamicModal.querySelector('#modal-coordinator');
	const modalPhone = dynamicModal.querySelector('#modal-phone');
	const modalRegisterBtn = dynamicModal.querySelector('#modal-register-btn');
	
	const celebrateBtn = document.getElementById('celebrate-btn');
	const fireworksCanvas = document.getElementById('fireworks-canvas');
	const ctx = fireworksCanvas.getContext('2d');
	
	let particles = [];
	let rockets = [];
	const colors = ['#ff0080', '#6a00ff', '#03dac5', '#ffc107', '#E91E63', '#9C27B0', '#2196F3', '#00BCD4'];
	
	function resizeCanvas() {
		fireworksCanvas.width = window.innerWidth;
		fireworksCanvas.height = window.innerHeight;
	}
	window.addEventListener('resize', resizeCanvas);
	resizeCanvas();

	function createRocket() {
		const startX = Math.random() * fireworksCanvas.width;
		const startY = fireworksCanvas.height;
		const targetX = Math.random() * fireworksCanvas.width;
		const targetY = fireworksCanvas.height / (2 + Math.random());
		const speed = 15;
		const angle = Math.atan2(targetY - startY, targetX - startX);
		const vx = Math.cos(angle) * speed;
		const vy = Math.sin(angle) * speed;

		rockets.push({
			x: startX,
			y: startY,
			vx: vx,
			vy: vy,
			targetY: targetY,
			color: `hsl(${Math.random() * 360}, 100%, 50%)`,
			alpha: 1,
			size: 2,
		});
	}
	
	function createFirework(x, y) {
		const particleCount = 100;
		const hue = Math.random() * 360;
		const color = `hsl(${hue}, 100%, 50%)`;
		for (let i = 0; i < particleCount; i++) {
			const angle = Math.random() * Math.PI * 2;
			const speed = Math.random() * 5 + 1;
			const vx = Math.cos(angle) * speed;
			const vy = Math.sin(angle) * speed;
			particles.push({
				x: x,
				y: y,
				vx: vx,
				vy: vy,
				color: colors[Math.floor(Math.random() * colors.length)],
				alpha: 1,
				size: Math.random() * 3 + 1,
				gravity: 0.1,
				friction: 0.95,
				decay: Math.random() * 0.015 + 0.005
			});
		}
	}

	function update() {
		ctx.clearRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);

		for (let i = rockets.length - 1; i >= 0; i--) {
			const r = rockets[i];
			r.y += r.vy;
			r.x += r.vx;
			r.vy += 0.1;
			
			ctx.beginPath();
			ctx.arc(r.x, r.y, r.size, 0, Math.PI * 2);
			ctx.fillStyle = r.color;
			ctx.globalAlpha = r.alpha;
			ctx.fill();

			if (r.y <= r.targetY) {
				createFirework(r.x, r.y);
				rockets.splice(i, 1);
			}
		}

		for (let i = particles.length - 1; i >= 0; i--) {
			const p = particles[i];
			p.vy += p.gravity;
			p.vx *= p.friction;
			p.vy *= p.friction;
			p.x += p.vx;
			p.y += p.vy;
			p.alpha -= p.decay;
			
			if (p.alpha <= p.decay) {
				particles.splice(i, 1);
				continue;
			}
			
			ctx.save();
			ctx.beginPath();
			ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
			ctx.fillStyle = p.color;
			ctx.globalAlpha = p.alpha;
			ctx.fill();
			ctx.restore();
		}
		requestAnimationFrame(update);
	}
	update();

	celebrateBtn.addEventListener('click', () => {
		createRocket();
	});

	modalTriggers.forEach(trigger => {
		trigger.addEventListener('click', () => {
			const title = trigger.dataset.title;
			const image = trigger.dataset.image;
			const description = trigger.dataset.description;
			const coordinator = trigger.dataset.coordinator;
			const phone = trigger.dataset.phone;
			const link = trigger.dataset.link;

			modalTitle.textContent = title;
			modalImage.src = image;
			modalDescription.textContent = description;
			modalCoordinator.textContent = coordinator;
			modalPhone.textContent = `Ph: ${phone}`;
			modalRegisterBtn.href = link;

			dynamicModal.classList.add('active');
		});
	});

	modalWrappers.forEach(modal => {
		modal.addEventListener('click', (event) => {
			if (event.target === modal || event.target.classList.contains('close-btn') || event.target.parentElement.classList.contains('close-btn')) {
				modal.classList.remove('active');
			}
		});
	});

	const teamTabs = document.querySelectorAll('.team-tab');
	const teamSections = document.querySelectorAll('#leadership-team, #hods-team, #students-team');
	const teamContainer = document.getElementById('team-container');

	function showTeamSection(targetId) {
		teamSections.forEach(section => {
			section.classList.add('hidden');
			section.classList.remove('elevated');
		});
		const activeSection = document.getElementById(targetId);
		if (activeSection) {
			activeSection.classList.remove('hidden');
		}

		teamContainer.classList.add('blurred');
		if (activeSection) {
			activeSection.classList.add('elevated');
		}
		setTimeout(() => {
			teamContainer.classList.remove('blurred');
		}, 500);
	}

	teamTabs.forEach(tab => {
		tab.addEventListener('click', () => {
			teamTabs.forEach(t => t.classList.remove('active'));
			tab.classList.add('active');
			showTeamSection(tab.dataset.target);
		});
	});

        // Initialize with 'Students' section active
	showTeamSection('students-team');

	function close(){
		modal.classList.remove('active');
	}

	
});