document.addEventListener('DOMContentLoaded', () => {
  /**
   *
   * SIDEBAR LIB
   *
   */
  // const currentPath = window.location.pathname;
  // const setActiveLink = () => {
  //   $('a[class*="navlink"]').removeClass('active');
  //   let activeLink = null;
  //   let maxMatchLength = 0;
  //   console.log($('a[class*="navlink"]'));
  //   $('a[class*="navlink"]').each(() => {
  //     console.log($(this).attr('href'));

  //     const linkPath = new URL($(this).attr('href'), `${window.location.origin}`).pathname;
  //     console.log({ linkPath, currentPath });
  //     if (linkPath === currentPath) {
  //       activeLink = $(this);
  //       maxMatchLength = linkPath.length;
  //       return;
  //     }
  //     if (currentPath.startsWith(linkPath) && linkPath !== '/app') {
  //       if (linkPath.length > maxMatchLength) {
  //         activeLink = $(this);
  //         maxMatchLength = linkPath.length;
  //       }
  //     }
  //     if (linkPath === '/app' && currentPath === '/app') {
  //       activeLink = $(this);
  //       maxMatchLength = linkPath.length;
  //     }
  //   });
  //   console.log(activeLink);
  //   if (activeLink) {
  //     activeLink.addClass('active');
  //   }
  // };
  // setActiveLink();
  // window.addEventListener('popstate', setActiveLink);
  // const originalPushState = history.pushState;
  // const originalReplaceState = history.replaceState;
  // history.pushState = function () {
  //   originalPushState.apply(history, arguments);
  //   setTimeout(setActiveLink, 0);
  // };
  // history.replaceState = function () {
  //   originalReplaceState.apply(history, arguments);
  //   setTimeout(setActiveLink, 0);
  // };

  const navLinks = document.querySelectorAll('a[class~="navlink"]');
  const currentPath = window.location.pathname;

  function setActiveLink() {
    // Remove existing active classes
    navLinks.forEach((link) => link.classList.remove('active'));

    let activeLink = null;
    let maxMatchLength = 0;

    navLinks.forEach((link) => {
      const linkPath = new URL(link.href).pathname;

      if (linkPath === currentPath) {
        activeLink = link;
        maxMatchLength = linkPath.length;
        return;
      }

      if (currentPath.startsWith(linkPath) && linkPath !== '/app') {
        if (linkPath.length > maxMatchLength) {
          activeLink = link;
          maxMatchLength = linkPath.length;
        }
      }

      if (linkPath === '/app' && currentPath === '/app') {
        activeLink = link;
        maxMatchLength = linkPath.length;
      }
    });

    if (activeLink) {
      activeLink.classList.add('active');
    }
  }

  setActiveLink();

  window.addEventListener('popstate', setActiveLink);

  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;

  history.pushState = function () {
    originalPushState.apply(history, arguments);
    setTimeout(setActiveLink, 0);
  };

  history.replaceState = function () {
    originalReplaceState.apply(history, arguments);
    setTimeout(setActiveLink, 0);
  };

  /**
   *
   * LOGIN LIB
   *
   */
  $('form[id="loginForm"]').on('submit', (event) => {
    event.preventDefault();
    console.log('Submitted');

    const username = $('input[name="username"]').val();
    const password = $('input[name="password"]').val();

    if (!username || !password) {
      return;
    }

    const data = JSON.stringify({
      username: username,
      password: password,
    });

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/auth/login');
    xhr.onload = () => {
      if (xhr.status !== 200) return console.log(`Error ${xhr.status}: ${xhr.statusText}`);
      else window.location.href = '/app';
    };
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.addEventListener('readystatechange', function () {
      if (this.readyState === this.DONE) {
        console.log(this.responseText);
      }
    });
    xhr.withCredentials = true;
    xhr.send(data);
  });

  /**
   *
   * User Action
   *
   */
  document.getElementById('logout-btn').addEventListener('click', (event) => {
    event.preventDefault();

    const xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/auth/logout');
    xhr.onload = () => {
      if (xhr.status !== 200) return console.log(`Error ${xhr.status}: ${xhr.statusText}`);
      else window.location.href = '/';
    };
    xhr.send();
  });

  /**
   *
   * Instance Panel
   *
   */
  const menuPanelButton = document.querySelectorAll('div[class~="tab"]');
  menuPanelButton.forEach((button) => {
    button.classList.remove('active-tab');
    if (currentPath.includes(button.id)) button.classList.add('active-tab');
    button.addEventListener('click', () => {
      try {
        let newPath = currentPath;
        const instanceMatch = currentPath.match(
          /^(\/app\/instances\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\/)([^\/]+)(\/.*)?$/,
        );

        if (instanceMatch) {
          const basePath = instanceMatch[1];
          const currentTab = instanceMatch[2];
          const subPath = instanceMatch[3] || '';

          newPath = basePath + button.id + subPath;
        } else {
          newPath = currentPath.endsWith('/') ? currentPath + button.id : currentPath + '/' + button.id;
        }

        if (newPath !== currentPath) {
          window.location.href = newPath;
        }
      } catch (error) {
        console.error('Error navigating:', error);
      }
    });
  });
});
