<template>
  <div class="loader relative w-full bg-white rounded overflow-hidden" />
</template>

<style scoped>
.loader:before {
  content: "";
  position: absolute;
  left: 0;
  bottom: -15%;
  width: 90%;
  height: 90%;
  transform: rotate(45deg) translate(30%, 40%);
  background: #3baa90;
  box-shadow: 32px -34px 0 5px #5fc6b5;
  z-index: 1;
  animation: slide 2s infinite ease-in-out alternate;
}

.loader:after {
  content: "";
  position: absolute;
  left: 10px;
  top: 10px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #5fc6b5;
  transform: rotate(0deg);
  transform-origin: 35px 145px;
  animation: rotate 3s infinite ease-in-out;
}

@keyframes slide {
  0%,
  100% {
    bottom: -15%;
  }

  25%,
  75% {
    bottom: -10%;
  }

  20%,
  80% {
    bottom: -8%;
  }
}

@keyframes rotate {
  0% {
    transform: rotate(-15deg);
  }

  25%,
  75% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(120deg);
  }
}
</style>
