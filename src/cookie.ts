export class Cookie {
    private cookie = new Map<string, string>();
  
    public constructor(cookies?: string[]) {
      if (cookies) this.add(cookies);
    }
  
    public set(name: string, value: string) {
      this.cookie.set(name, value);
      return this;
    }

    public get(name: string) {
      return this.cookie.get(name)
    }
  
    public add(cookies: string[]) {
      cookies.forEach(str => {
        const [nv] = str.split(';');
        const [name, ...values] = nv.split('=');
        this.cookie.set(name, values.join('='));
      });
      return this;
    }
  
    public del(name: string) {
      this.cookie.delete(name);
      return this;
    }
  
    public toString() {
      return Array.from(this.cookie.entries())
        .map(([name, value]) => `${name}=${value}`)
        .join('; ');
    }

    public static getValueFromCookieString(cookieString: string, key: string) {
      const cookieArray = cookieString.split('; ');
      const cookieItem = cookieArray.find(item => item.startsWith(key + '='));
      return cookieItem ? cookieItem.split('=')[1] : "";
    }
  }