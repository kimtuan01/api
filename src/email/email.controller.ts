import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller({
  version: '1',
  path: 'email',
})
export class EmailController {
  @Get('deep-redirect')
  deepRedirect(@Query('token') token: string, @Res() res: Response) {
    const url = `lunariamobile://(auth)/reset-password?token=${token}`;
    const html = `
    <html>
      <head>
        <meta http-equiv="refresh" content="0;url=${url}" />
        <title>Redirecting...</title>
      </head>
      <body>
        <p>Đang mở ứng dụng...</p>
        <noscript>
          <p>Nếu không được chuyển hướng, <a href="${url}">bấm vào đây</a>.</p>
        </noscript>
      </body>
    </html>
  `;
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  }
}
