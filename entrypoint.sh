#!/bin/sh
# Clear the config.js and set the domain
echo 'var domain = "'"$DOMAIN"'";' > /usr/share/nginx/html/js/config.js

# Start nginx
exec "$@"
