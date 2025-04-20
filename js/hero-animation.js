// ヒーローセクションのインタラクティブな背景アニメーション

document.addEventListener('DOMContentLoaded', () => {
  // Canvas要素の設定
  const canvas = document.getElementById('hero-canvas');
  const ctx = canvas.getContext('2d');
  
  // キャンバスを画面サイズに合わせる
  function resizeCanvas() {
    const heroSection = document.querySelector('.hero');
    canvas.width = heroSection.offsetWidth;
    canvas.height = heroSection.offsetHeight;
  }
  
  // 初期化時とリサイズ時にキャンバスサイズを調整
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  
  // パーティクルの設定
  const particlesArray = [];
  const numberOfParticles = window.innerWidth < 768 ? 80 : 150; // レスポンシブ対応
  
  // マウス位置の追跡
  const mouse = {
    x: null,
    y: null,
    radius: 150
  };
  
  // マウス位置の更新
  window.addEventListener('mousemove', (event) => {
    // キャンバス内の相対位置を計算
    const rect = canvas.getBoundingClientRect();
    mouse.x = event.clientX - rect.left;
    mouse.y = event.clientY - rect.top;
  });
  
  // マウスがキャンバス外に出た時の処理
  window.addEventListener('mouseout', () => {
    mouse.x = undefined;
    mouse.y = undefined;
  });
  
  // Particle クラス
  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 1.5 + 0.5;
      this.baseSize = this.size;
      this.speedX = Math.random() * 1 - 0.5;
      this.speedY = Math.random() * 1 - 0.5;
      this.color = '#ffffff';
      this.highlightColor = '#3498db';
      this.isHighlighted = false;
      this.alpha = 0.4;
    }
    
    // パーティクルの更新
    update() {
      // 位置の更新
      this.x += this.speedX;
      this.y += this.speedY;
      
      // 画面外に出た場合、反対側から再登場
      if (this.x < 0) this.x = canvas.width;
      if (this.x > canvas.width) this.x = 0;
      if (this.y < 0) this.y = canvas.height;
      if (this.y > canvas.height) this.y = 0;
      
      // マウスとの距離を計算
      if (mouse.x !== undefined && mouse.y !== undefined) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // マウスの影響範囲内かどうかを判定
        if (distance < mouse.radius) {
          this.isHighlighted = true;
          this.size = this.baseSize * 2; // ハイライト時にサイズを大きく
        } else {
          this.isHighlighted = false;
          this.size = this.baseSize;
        }
      } else {
        this.isHighlighted = false;
        this.size = this.baseSize;
      }
    }
    
    // パーティクルの描画
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.isHighlighted ? this.highlightColor : this.color;
      ctx.globalAlpha = this.isHighlighted ? 1 : this.alpha;
      ctx.fill();
    }
  }
  
  // 線を描画する関数
  function drawLines() {
    let connectionRadius = canvas.width > 768 ? 130 : 90;
    
    for (let a = 0; a < particlesArray.length; a++) {
      for (let b = a; b < particlesArray.length; b++) {
        const dx = particlesArray[a].x - particlesArray[b].x;
        const dy = particlesArray[a].y - particlesArray[b].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < connectionRadius) {
          // いずれかのパーティクルがハイライトされているかどうか
          const isHighlighted = particlesArray[a].isHighlighted || particlesArray[b].isHighlighted;
          
          // 線の透明度を距離に応じて計算（近いほど不透明）
          const opacity = isHighlighted ? 1 - (distance / connectionRadius * 0.8) : 0.5 - (distance / connectionRadius * 0.5);
          
          // 線の色を設定（ハイライト時と通常時）
          const strokeColor = isHighlighted ? '#3498db' : '#ffffff';
          
          ctx.strokeStyle = strokeColor;
          ctx.globalAlpha = opacity;
          ctx.lineWidth = isHighlighted ? 0.8 : 0.5;
          
          ctx.beginPath();
          ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
          ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
          ctx.stroke();
        }
      }
    }
  }
  
  // パーティクルの初期化
  function initParticles() {
    for (let i = 0; i < numberOfParticles; i++) {
      particlesArray.push(new Particle());
    }
  }
  
  // アニメーションループ
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // パーティクルの更新と描画
    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update();
      particlesArray[i].draw();
    }
    
    // パーティクル間の線を描画
    drawLines();
    
    requestAnimationFrame(animate);
  }
  
  // アニメーションの開始
  initParticles();
  animate();
});
