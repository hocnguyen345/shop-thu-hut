document.addEventListener("DOMContentLoaded", () => {
    // --- 1. Cấu hình sản phẩm ---
    const products = [
      { id: 1, name: "Cừu bông", price: 100000, image: "https://gaubongmall.com/wp-content/uploads/2022/06/gau-bong-cuu-beo-G1220-1654142594031.jpg" },
      { id: 2, name: "Gà ngố", price: 200000, image: "https://mms.img.susercontent.com/0820f9569e773246179aadf112539615_tn" },
      { id: 3, name: "Gấu bông 3", price: 150000, image: "https://gaubongmall.com/wp-content/uploads/2022/06/gau-bong-cuu-beo-G1220-1654142594031.jpg" },
      { id: 4, name: "Gấu bông 4", price: 120000, image: "https://gaubongmall.com/wp-content/uploads/2022/06/gau-bong-cuu-beo-G1220-1654142594031.jpg" },
      { id: 5, name: "Gấu bông 5", price: 180000, image: "https://gaubongmall.com/wp-content/uploads/2022/06/gau-bong-cuu-beo-G1220-1654142594031.jpg" },
      { id: 6, name: "Gấu bông 6", price: 220000, image: "https://gaubongmall.com/wp-content/uploads/2022/06/gau-bong-cuu-beo-G1220-1654142594031.jpg" },
      { id: 7, name: "Gấu bông 7", price: 250000, image: "https://gaubongmall.com/wp-content/uploads/2022/06/gau-bong-cuu-beo-G1220-1654142594031.jpg" },
      { id: 8, name: "Gấu bông 8", price: 130000, image: "https://gaubongmall.com/wp-content/uploads/2022/06/gau-bong-cuu-beo-G1220-1654142594031.jpg" }
    ];
  
    // --- 2. Render danh sách sản phẩm ---
    const productsContainer = document.querySelector(".products");
    const renderProducts = (filter = "") => {
      productsContainer.innerHTML = "";
      products
        .filter(product => product.name.toLowerCase().includes(filter.toLowerCase()))
        .forEach(product => {
          const productDiv = document.createElement("div");
          productDiv.className = "product";
          productDiv.dataset.id = product.id;
          productDiv.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h2>${product.name}</h2>
            <p>Giá: ${product.price.toLocaleString()}đ</p>
            <button class="add-to-cart">Thêm vào giỏ</button>
          `;
          productsContainer.appendChild(productDiv);
        });
    };
    renderProducts();
  
    // --- 3. Tìm kiếm sản phẩm ---
    let searchBar = document.getElementById("search-bar");
    if (!searchBar) {
      // Nếu chưa có, tạo ô tìm kiếm ở đầu danh sách sản phẩm
      searchBar = document.createElement("input");
      searchBar.type = "text";
      searchBar.id = "search-bar";
      searchBar.placeholder = "Tìm sản phẩm...";
      productsContainer.parentElement.insertBefore(searchBar, productsContainer);
    }
    searchBar.addEventListener("input", (e) => {
      renderProducts(e.target.value);
    });
  
    // --- 4. Giỏ hàng nâng cao ---
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
  
    const cartItemsContainer = document.getElementById("cart-items");
    const cartTotalEl = document.getElementById("cart-total");
  
    const updateCartUI = () => {
      cartItemsContainer.innerHTML = "";
      if (cart.length === 0) {
        cartItemsContainer.innerHTML = "<li>Giỏ hàng trống</li>";
      } else {
        cart.forEach((item, index) => {
          const li = document.createElement("li");
          li.className = "cart-item";
          li.innerHTML = `
            <span>${item.name} (${item.price.toLocaleString()}đ) x 
              <input type="number" min="1" value="${item.quantity}" data-index="${index}" class="quantity-input" style="width:50px;">
            </span>
            <button data-index="${index}" class="remove-btn">Xóa</button>
          `;
          cartItemsContainer.appendChild(li);
        });
      }
      const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      cartTotalEl.innerText = total.toLocaleString();
      localStorage.setItem("cart", JSON.stringify(cart));
    };
  
    // Thêm sự kiện thay đổi số lượng và xóa sản phẩm qua delegation
    cartItemsContainer.addEventListener("change", (e) => {
      if (e.target.classList.contains("quantity-input")) {
        const idx = e.target.dataset.index;
        const newQuantity = parseInt(e.target.value);
        if (newQuantity > 0) {
          cart[idx].quantity = newQuantity;
          updateCartUI();
        }
      }
    });
    cartItemsContainer.addEventListener("click", (e) => {
      if (e.target.classList.contains("remove-btn")) {
        const idx = e.target.dataset.index;
        cart.splice(idx, 1);
        updateCartUI();
      }
    });
  
    // Thêm sản phẩm vào giỏ hàng
    productsContainer.addEventListener("click", (e) => {
      if (e.target.classList.contains("add-to-cart")) {
        const productDiv = e.target.closest(".product");
        const id = parseInt(productDiv.dataset.id);
        const product = products.find(p => p.id === id);
        const existingItem = cart.find(item => item.id === id);
        if (existingItem) {
          existingItem.quantity++;
        } else {
          cart.push({ ...product, quantity: 1 });
        }
        updateCartUI();
        // Hiệu ứng toast thông báo
        showToast(`${product.name} đã được thêm vào giỏ hàng!`);
      }
    });
  
    // --- 5. Xử lý Thanh toán ---
    const checkoutBtn = document.getElementById("checkout");
    checkoutBtn.addEventListener("click", () => {
      if (cart.length === 0) {
        alert("Giỏ hàng của bạn trống!");
        return;
      }
      // Giả lập quy trình thanh toán
      alert("Thanh toán thành công! Cảm ơn bạn đã mua hàng.");
      cart = [];
      updateCartUI();
    });
  
    // --- 6. Widget Chat Hỗ trợ ---
    const createChatWidget = () => {
      const chatWidget = document.createElement("div");
      chatWidget.id = "chat-widget";
      chatWidget.style.position = "fixed";
      chatWidget.style.bottom = "20px";
      chatWidget.style.right = "20px";
      chatWidget.style.width = "300px";
      chatWidget.style.background = "white";
      chatWidget.style.border = "1px solid #ccc";
      chatWidget.style.borderRadius = "10px";
      chatWidget.style.boxShadow = "0 0 10px rgba(0,0,0,0.3)";
      chatWidget.style.overflow = "hidden";
      
      // Header widget
      const chatHeader = document.createElement("div");
      chatHeader.style.background = "#ff6699";
      chatHeader.style.color = "white";
      chatHeader.style.padding = "10px";
      chatHeader.style.cursor = "pointer";
      chatHeader.innerText = "Chat hỗ trợ";
      chatWidget.appendChild(chatHeader);
      
      // Nội dung chat
      const chatContent = document.createElement("div");
      chatContent.id = "chat-content";
      chatContent.style.height = "200px";
      chatContent.style.overflowY = "auto";
      chatContent.style.padding = "10px";
      chatContent.style.display = "none"; // ẩn ban đầu
      chatWidget.appendChild(chatContent);
      
      // Input chat
      const chatInputContainer = document.createElement("div");
      chatInputContainer.style.display = "none";
      chatInputContainer.style.padding = "10px";
      chatInputContainer.innerHTML = `
        <input type="text" id="chat-input" placeholder="Nhập tin nhắn..." style="width:80%; padding:5px;">
        <button id="chat-send" style="padding:5px;">Gửi</button>
      `;
      chatWidget.appendChild(chatInputContainer);
      
      document.body.appendChild(chatWidget);
      
      // Toggle chat content
      chatHeader.addEventListener("click", () => {
        const isVisible = chatContent.style.display === "block";
        chatContent.style.display = isVisible ? "none" : "block";
        chatInputContainer.style.display = isVisible ? "none" : "block";
      });
      
      // Gửi tin nhắn
      document.getElementById("chat-send").addEventListener("click", () => {
        const input = document.getElementById("chat-input");
        const message = input.value.trim();
        if (message !== "") {
          appendChatMessage("Bạn", message);
          input.value = "";
          // Phản hồi tự động
          setTimeout(() => {
            appendChatMessage("Hỗ trợ", getAutoResponse(message));
          }, 800);
        }
      });
      
      const appendChatMessage = (sender, msg) => {
        const msgDiv = document.createElement("div");
        msgDiv.style.marginBottom = "10px";
        msgDiv.innerHTML = `<strong>${sender}:</strong> ${msg}`;
        chatContent.appendChild(msgDiv);
        chatContent.scrollTop = chatContent.scrollHeight;
      };
      
      const getAutoResponse = (userMsg) => {
        // Phản hồi tự động đơn giản dựa trên từ khóa
        if (userMsg.toLowerCase().includes("hello") || userMsg.toLowerCase().includes("chào")) {
          return "Xin chào! Tôi có thể giúp gì cho bạn?";
        }
        if (userMsg.toLowerCase().includes("giá")) {
          return "Bạn có thể xem giá sản phẩm ở mục sản phẩm. Nếu cần tư vấn, hãy cho tôi biết!";
        }
        return "Cảm ơn bạn đã liên hệ, chúng tôi sẽ phản hồi sớm.";
      };
    };
    createChatWidget();
  
    // --- 7. Hiệu ứng Toast thông báo ---
    const showToast = (msg) => {
      const toast = document.createElement("div");
      toast.innerText = msg;
      toast.style.position = "fixed";
      toast.style.bottom = "80px";
      toast.style.right = "20px";
      toast.style.background = "rgba(0,0,0,0.7)";
      toast.style.color = "white";
      toast.style.padding = "10px 20px";
      toast.style.borderRadius = "5px";
      toast.style.opacity = "0";
      toast.style.transition = "opacity 0.5s";
      document.body.appendChild(toast);
      setTimeout(() => { toast.style.opacity = "1"; }, 100);
      setTimeout(() => {
        toast.style.opacity = "0";
        setTimeout(() => toast.remove(), 500);
      }, 2000);
    };
  
    // Cập nhật UI giỏ hàng khi load trang
    updateCartUI();
  });
  
  
    updateCartUI();
  
  