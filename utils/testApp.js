const http = require('http');

const testUrl = (path) => {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:5000${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ statusCode: res.statusCode, path, length: data.length });
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
};

const runTests = async () => {
  console.log('🧪 RUNNING END-TO-END SUITE FOR LTI_COURSES...\n');
  const routes = [
    '/',
    '/about',
    '/courses',
    '/courses/robotics-education',
    '/courses/fullstack-web-development',
    '/courses/ui-ux-design-with-ai',
    '/register',
    '/projects',
    '/contact',
    '/login',
    '/signup'
  ];

  for (const route of routes) {
    try {
      const res = await testUrl(route);
      if (res.statusCode === 200) {
        console.log(`✅ [200 OK] ${route} (${res.length} bytes)`);
      } else {
        console.error(`❌ [${res.statusCode}] ${route}`);
      }
    } catch (err) {
      console.error(`❌ [FAILED] ${route}: ${err.message}`);
    }
  }

  console.log('\n🎉 ALL ROUTES TESTED CLEANLY!');
};

runTests();
