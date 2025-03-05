import pandas as pd

data = {
    'Name': ['Anna', 'Bob', 'Cara'],
    'Age': [25, 30, 22],
    'City': ['Kyiv', 'Lviv', 'Odesa']
}

df = pd.DataFrame(data)
d=df.dropna(axis=1)
print(d)