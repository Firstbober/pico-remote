def enum(**enums):
    values = {}
    for key, value in enums.items():
        values[key]=(value, key)

    t = type('Enum', (), values)
    t.items = enums
    return t
