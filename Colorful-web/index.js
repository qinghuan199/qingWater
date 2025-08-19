  // 轮播图数据
  const carouselData = Array.from({ length: 64 }, (_, i) => {
    const index = i + 1; // 1~64
    const descriptions = [
      "直播美女", "互動交友", "網紅女神", "顏值主播", "甜蜜約會", 
      "在線連麥", "熱舞直播", "語音聊天", "視頻交友", "浪漫邂逅",
      "心動匹配", "同城交友", "才藝主播", "情感連線", "一對一視頻",
      "女神直播", "深夜陪伴", "線上K歌", "遊戲陪玩", "虛擬戀人",
      "美女主播", "真人互動", "在線約會", "顏值PK", "熱門直播",
      "心動速配", "情感諮詢", "直播打賞", "魅力女神", "甜蜜互動",
      "高顏值主播", "在線陪伴", "語音直播", "視頻聊天", "直播帶貨",
      "美女才藝", "線上社交", "同城速配", "直播PK", "虛擬禮物",
      "女神在線", "情感電台", "直播綜藝", "語音交友", "視頻約會",
      "熱門主播", "甜蜜語聊", "線上相親", "直播娛樂", "美女陪聊",
      "心動直播", "互動遊戲", "在線相親", "直播紅人", "語音速配",
      "視頻社交", "女神陪玩", "直播歌房", "線上派對", "虛擬戀愛",
      "美女才藝秀", "同城直播", "語音派對", "視頻速配"
    ];
    
    // 确保描述不重复（若超过数组长度则循环使用）
    const text = descriptions[i % descriptions.length];
    return {
      imgSrc: `./pictrue/${index}.png`, // 图片路径（1.png ~ 64.png）
      text: text,
    };
  });
const carousel = document.querySelector('.carousel');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');

let currentIndex = 0;
let isAnimating = false;
let autoPlayInterval;

// 初始化轮播图
function initCarousel() {
    carousel.innerHTML = '';
    
    // 在开头添加最后一个项目的克隆
    const lastClone = createCarouselItem(carouselData[carouselData.length - 1]);
    carousel.appendChild(lastClone);
    
    // 添加所有真实项目
    carouselData.forEach(item => {
        carousel.appendChild(createCarouselItem(item));
    });
    
    // 在末尾添加第一个项目的克隆
    const firstClone = createCarouselItem(carouselData[0]);
    carousel.appendChild(firstClone);
    
    // 初始位置设为第一个真实项目（索引1）
    currentIndex = 1;
    updateCarousel(false);
    
    // 启动自动轮播
    startAutoPlay();
}

function createCarouselItem(data) {
    const item = document.createElement('div');
    item.className = 'carousel-item';
    item.innerHTML = `
        <img src="${data.imgSrc}" alt="${data.text}">
        <span>${data.text}</span>
    `;
    return item;
}

// 更新轮播图位置
function updateCarousel(withAnimation = true) {
    const items = document.querySelectorAll('.carousel-item');
    const itemWidth = items[0].offsetWidth;
    
    if (withAnimation) {
        carousel.style.transition = 'transform 0.5s ease';
    } else {
        carousel.style.transition = 'none';
    }
    
    carousel.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
    
    // 更新active类
    items.forEach((item, index) => {
        item.classList.toggle('active', index === currentIndex);
    });
}

// 处理轮播图边界情况
function handleBoundary() {
    const items = document.querySelectorAll('.carousel-item');
    
    // 如果到达最后一个克隆项目，无动画跳转到第一个真实项目
    if (currentIndex >= items.length - 1) {
        currentIndex = 1;
        updateCarousel(false);
    }
    // 如果到达第一个克隆项目，无动画跳转到最后一个真实项目
    else if (currentIndex <= 0) {
        currentIndex = items.length - 2;
        updateCarousel(false);
    }
}

// 下一张
function nextSlide() {
    if (isAnimating) return;
    
    isAnimating = true;
    currentIndex++;
    updateCarousel();
    
    setTimeout(() => {
        handleBoundary();
        isAnimating = false;
    }, 500);
}

// 上一张
function prevSlide() {
    if (isAnimating) return;
    
    isAnimating = true;
    currentIndex--;
    updateCarousel();
    
    setTimeout(() => {
        handleBoundary();
        isAnimating = false;
    }, 500);
}

// 启动自动轮播
function startAutoPlay() {
    autoPlayInterval = setInterval(nextSlide, 3000);
}

// 停止自动轮播
function stopAutoPlay() {
    clearInterval(autoPlayInterval);
}

// 事件监听
prevBtn.addEventListener('click', () => {
    stopAutoPlay();
    prevSlide();
    startAutoPlay();
});

nextBtn.addEventListener('click', () => {
    stopAutoPlay();
    nextSlide();
    startAutoPlay();
});

// 鼠标悬停时暂停自动轮播
carousel.addEventListener('mouseenter', stopAutoPlay);
carousel.addEventListener('mouseleave', startAutoPlay);

// 窗口大小变化时重新计算位置
window.addEventListener('resize', () => {
    updateCarousel(false);
});

// 初始化
initCarousel();