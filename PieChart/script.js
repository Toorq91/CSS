const canvas = document.getElementById('pieChart');
const ctx = canvas.getContext('2d');

const inputs = ['val1', 'val2', 'val3'].map(id => document.getElementById(id));
const colors = ['#2E8B57', '#FF00BF', '#324AB2'];

let animationProgress = 0;
const animationSpeed = 0.008; // Smaller = slower animation

function animateChart() {
  animationProgress += animationSpeed;
  if (animationProgress > 1) animationProgress = 1;

  drawPieChart(animationProgress);

  if (animationProgress < 1) {
    requestAnimationFrame(animateChart);
  }
}

function drawPieChart(progress = 1) {
  const values = inputs.map(input => parseFloat(input.value) || 0);
  const total = values.reduce((sum, val) => sum + val, 0);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const outerRadius = 200;
  const innerRadius = 60;

  let startAngle = 0;

  values.forEach((value, i) => {
    const sliceAngle = (value / total) * 2 * Math.PI * progress;
    const endAngle = startAngle + sliceAngle;

    // Draw slice
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, outerRadius, startAngle, endAngle);
    ctx.lineTo(centerX, centerY);
    ctx.fillStyle = colors[i];
    ctx.fill();

    // Draw % label only after animation completes
    if (progress === 1) {
      const midAngle = startAngle + sliceAngle / 2;
      const labelX = centerX + Math.cos(midAngle) * 100;
      const labelY = centerY + Math.sin(midAngle) * 100;
      const percent = total > 0 ? ((value / total) * 100).toFixed(1) + '%' : '';

      ctx.fillStyle = 'white';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      if (percent !== 'NaN%') {
        ctx.fillText(percent, labelX, labelY);
      }
    }

    startAngle = endAngle;
  });

  // Draw hollow center
  ctx.beginPath();
  ctx.fillStyle = '#002147'; // background color
  ctx.arc(centerX, centerY, innerRadius, 0, 2 * Math.PI);
  ctx.fill();
}

// Trigger animation on input changes
inputs.forEach(input =>
  input.addEventListener('input', () => {
    animationProgress = 0;
    requestAnimationFrame(animateChart);
  })
);

// Initial draw with animation
animationProgress = 0;
requestAnimationFrame(animateChart);
