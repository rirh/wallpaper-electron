# -*- coding:utf-8 -*-

import requests
import json
import re

se = requests.session()
RANDAPIURL = 'https://api.unsplash.com/photos/random?count=30&orientation=landscape'
YOUR_APPLICATION_ID = '6acf679c2c2e383123a9c1aa1cd719ca041f1484463cd3e109eb14b57ce9c953'
header = {
    'Accept-Version': 'v1',
    'Authorization': 'Client-ID %s' % YOUR_APPLICATION_ID,
    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.110 Safari/537.36',
}


def downloadpic(urlinfo):
    for (name, url) in urlinfo.items():
        # savepath = r'C:UsersAdministratorPictures%s' % name
        content = se.get(url, headers=header).content
    # with open(savepath, 'wb') as fopen:
    #     fopen.write(content)


def getrandurls():
    global header
    print(RANDAPIURL)
    print(header)
    resptext = se.get(RANDAPIURL, headers=header).text
    urlinfo = {}
    jsontext = json.loads(resptext)

    # for onejson in jsontext:
    #     url = onejson['urls']['full']
    #     fm = re.findall(r'(?<=fm=)w{3}(?=&)', url)[0]
    # if 'location' in onejson.keys():
    #     picname = '%s.%s' % (onejson['location']['title'], fm.encode('utf-8'))
    # else:
    #     picname = '%s.%s' % (onejson['id'], fm.encode('utf-8'))
    #     urlinfo[picname] = url
    return jsontext


def main():
    urlinfo = getrandurls()
    # print(urlinfo)

    # downloadpic(urlinfo)


if __name__ == '__main__':
    main()
