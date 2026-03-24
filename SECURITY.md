# Security Configuration

## Security Guidelines for This Application

### 1. Environment Variables
- **NEVER** commit `.env` files to git
- **ALWAYS** use `.env.example` as a template
- **ROTATE** API keys regularly (every 90 days minimum)
- **SEPARATE** development and production API keys

### 2. API Key Management
- Store keys in environment variables only
- Use secure password managers for backup storage
- Limit key permissions to minimum required
- Monitor API key usage in Anthropic console

### 3. Input Validation
- Maximum query length: 2000 characters
- Control characters are automatically stripped
- Empty queries are rejected
- All user input is sanitized before processing

### 4. Error Handling
- Error messages are sanitized (no internal details exposed)
- API errors are translated to user-friendly messages
- Full error details only in development mode
- No stack traces exposed to end users

### 5. Rate Limiting
- Handled by Anthropic API (built-in protection)
- Token usage tracking implemented
- Cost monitoring and alerts recommended

### 6. Dependency Security
- Run `npm audit` regularly
- Update dependencies monthly
- Review security advisories
- Use only trusted packages from npm

### 7. Development Practices
- Enable TypeScript strict mode
- Use type safety features
- Conduct code reviews
- Follow principle of least privilege

## Security Checklist for Deployment

### Before Going to Production:
- [ ] Separate API keys for production
- [ ] Set up cost alerts in Anthropic console
- [ ] Configure production logging (no sensitive data)
- [ ] Enable HTTPS if building web interface
- [ ] Review and test all error scenarios
- [ ] Conduct penetration testing
- [ ] Set up monitoring and alerting
- [ ] Document incident response procedures

### Regular Maintenance:
- [ ] Rotate API keys every 90 days
- [ ] Review access logs monthly
- [ ] Update dependencies monthly
- [ ] Run security audit quarterly
- [ ] Review and update security policies

## Incident Response

### If API Key is Compromised:
1. **Immediately** revoke the compromised key in Anthropic console
2. Generate a new API key
3. Update `.env` file with new key
4. Review API usage logs for unauthorized access
5. Change any related credentials
6. Document the incident

### If Suspicious Activity Detected:
1. Review API usage in Anthropic console
2. Check for unusual patterns or spikes
3. Verify all API calls are legitimate
4. Rotate API key if concerned
5. Contact Anthropic support if needed

## Contact for Security Issues

If you discover a security vulnerability:
1. **DO NOT** open a public GitHub issue
2. Contact repository maintainer directly
3. Provide detailed information about the vulnerability
4. Allow time for a fix before public disclosure

## Compliance Notes

### Data Privacy:
- This application processes user queries locally
- Queries are sent to Anthropic API for processing
- No user data is stored persistently
- Review Anthropic's privacy policy for API data handling

### Data Retention:
- Conversation history is kept in memory only
- No persistent storage of conversations
- History cleared on application exit
- Use `clear` command to reset history during session

## Security Updates

**Last Security Audit:** March 24, 2026
**Next Scheduled Audit:** June 24, 2026

### Recent Security Improvements:
- Added input validation and sanitization
- Implemented error message sanitization
- Added API key validation on startup
- Reduced API key exposure in logs
- Created comprehensive security documentation

---

**Remember:** Security is an ongoing process, not a one-time task. Stay vigilant and keep security practices up to date.
