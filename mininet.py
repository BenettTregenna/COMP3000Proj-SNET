print('Hello from python')


confFile = open("networkConf.py", "w")
confFile.write("sample file write")
confFile.close()

confFile = open("networkConf.py", "r")
print(confFile.read())