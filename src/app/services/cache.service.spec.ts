import { CacheService } from './cache.service';
import { TestBed } from '@angular/core/testing';

describe('CacheService', () => {
  let service: CacheService;

  const mockData = {item: 'test'};

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CacheService);
    service.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a new items successfully', async() => {

    expect(await service.getItem('test').catch(err => err)).toBe('Key not found');

    service.setItem('test', mockData);

    expect(await service.getItem('test')).toEqual(mockData);
  });

  it('should remove item', async() => {
    service.setItem('test', mockData);

    await service.removeItem('test');
    expect(await service.getItem('test').catch(err => err)).toBe('Key not found');
  });

  it('should fail at remove item because it does not exist', async() => {
    let failed = false;
    await service.removeItem('test').catch(err => failed = true);

    expect(failed).toBeTruthy;
  });

  it('should clear entire sessionStorage without fail if it is already empty', async() => {
    
    expect(service.clear()).toBeUndefined();
    service.setItem('test', mockData);
    service.clear();
    expect(await service.getItem('test').catch(err => err)).toBe('Key not found');
  });



});
