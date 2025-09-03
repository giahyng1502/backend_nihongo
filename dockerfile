# Sử dụng image Node.js chính thức
FROM node:18

# Tạo thư mục chứa app
WORKDIR /app

# Copy package.json và cài dependency
COPY package*.json ./
RUN npm install

# Copy toàn bộ source code
COPY . .

# Mở cổng backend (nếu dùng Express mặc định là 3000)
EXPOSE 3000

# Chạy ứng dụng
CMD ["npm", "start"]
