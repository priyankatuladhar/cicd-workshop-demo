# Break & Fix Demo Guide

## 🐛 Bug Introduction Options

### Option 1: Syntax Error
```javascript
// In app.js, change this:
app.get('/', (req, res) => {
  res.send(`<h1>${message}</h1>`);
});

// To this (missing closing brace):
app.get('/', (req, res) => {
  res.send(`<h1>${message}</h1>`);
// Missing });
```

### Option 2: Port Conflict
```javascript
// Change PORT to invalid value
const PORT = "invalid_port";
```

### Option 3: Missing Dependency
```javascript
// Add this line at top of app.js
const nonExistentModule = require('does-not-exist');
```

### Option 4: Test Failure
```javascript
// In test file, create failing test
test('should fail', () => {
  expect(1 + 1).toBe(3); // Wrong expectation
});
```

## 🔍 What Students Will See

### GitHub Actions Failure:
- ❌ Red X on commit
- Build logs showing error
- Email notification (if enabled)
- Deployment blocked

### VM Status:
- Old version still running
- No new deployment occurred
- Application remains stable

## 🛠️ Fix Process

1. **Identify** error in GitHub Actions logs
2. **Fix** the code locally
3. **Commit** and push fix
4. **Watch** CI/CD succeed
5. **Verify** deployment works

## 🎯 Learning Points

- CI/CD prevents bad code from reaching production
- Automated testing catches errors early
- Failed deployments don't break existing app
- Quick feedback loop for developers